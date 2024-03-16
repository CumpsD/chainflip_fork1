import { Squid } from '@0xsquid/sdk';
import {
  type StatusResponse as SquidSdkStatusResponse,
  type Token as SquidSdkToken,
  type RouteRequest as SquidSdkRouteRequest,
  type RouteActionResponse as SquidSdkRouteAction,
  ChainType as SquidSdkChainType,
  SlippageMode as SquidSdkSlippageMode,
  ActionType as SquidSdkActionType,
} from '@0xsquid/sdk/dist/types';
import { isAxiosError } from 'axios';
import { type WalletClient } from 'wagmi';
import { AxelarLogo } from '@/shared/assets/chain-logos';
import { chainById, type ChainId } from '@/shared/assets/chains';
import { chainTransparentLogo } from '@/shared/assets/chains/logo';
import { type Token, tokenByAddress } from '@/shared/assets/tokens';
import { NATIVE_TOKEN_ADDRESS } from '@/shared/assets/tokens/constants';
import { isTestnet } from '@/shared/featureFlags';
import { walletClientToEthersV5Signer } from '@/shared/hooks/useEthersSigner';
import { TokenAmount, isTruthy, assert } from '@/shared/utils';
import { type BaseIntegration, getDeterministicRouteId } from './manager';
import { loadRouteFromLocalStorage, storeTransactionHashInLocalStorage } from './storage';
import SquidLogo from '../assets/logo/squid';
import { client } from '../client';
import { ZERO_EVM_ADDRESS } from '../utils/consts';
import {
  type EventLog,
  type ExecuteSwapResponse,
  type RouteRequest,
  type RouteResponseStep,
  type SquidRouteResponse,
  type SwapStatus,
} from '.';

const SQUID_NATIVE_TOKEN_ADDRESS = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
const SQUID_DEFAULT_SLIPPAGE = 3; // 3%

const squidLogMap: Partial<Record<SwapStatus | 'default', { order: number; message: string }>> = {
  default: {
    order: 0,
    message: 'Transaction submitted',
  },
  waiting_for_src_tx: {
    order: 1,
    message: 'Bridge transaction initiated, waiting for execution',
  },
  waiting_for_dest_tx: {
    order: 2,
    message: 'Waiting for destination chain',
  },
  completed: { order: 3, message: 'Bridge/Swap has completed' },
};

const mapSquidChainId = (squidChainType: SquidSdkChainType, squidChainId: string): ChainId =>
  squidChainType === SquidSdkChainType.EVM
    ? `evm-${Number(squidChainId)}`
    : `${squidChainType}-${squidChainId}`;

const mapChainIdToSquid = (chainId: ChainId): string | undefined => {
  if (chainId.startsWith('evm-')) {
    return chainId.replace('evm-', '');
  }
  if (chainId.startsWith('cosmos-')) {
    return chainId.replace('cosmos-', '');
  }
  return undefined;
};

const mapSquidTokenAddress = (squidAddress: string): string =>
  squidAddress === SQUID_NATIVE_TOKEN_ADDRESS ? NATIVE_TOKEN_ADDRESS : squidAddress;

const mapTokenAddressToSquid = (address: string): string =>
  address === NATIVE_TOKEN_ADDRESS ? SQUID_NATIVE_TOKEN_ADDRESS : address;

const mapSquidToken = (squidToken: SquidSdkToken): Token =>
  tokenByAddress(
    mapSquidChainId(squidToken.type, squidToken.chainId),
    mapSquidTokenAddress(squidToken.address),
    squidToken.logoURI,
    {
      name: squidToken.name,
      symbol: squidToken.symbol,
      decimals: squidToken.decimals,
    },
  );

const mapSquidAction = (squidAction: SquidSdkRouteAction): RouteResponseStep | undefined => {
  const srcToken = mapSquidToken(squidAction.fromToken);
  const srcAmount = new TokenAmount(squidAction.fromAmount, srcToken.decimals);
  const destToken = mapSquidToken(squidAction.toToken);
  const destAmount = new TokenAmount(squidAction.toAmount, destToken.decimals);

  if (squidAction.type === SquidSdkActionType.SWAP) {
    return {
      protocolName: squidAction.provider ?? 'Squid Router',
      protocolLink: undefined,
      srcToken,
      srcAmount,
      destToken,
      destAmount,
    };
  }

  if (squidAction.type === SquidSdkActionType.BRIDGE) {
    return {
      protocolName: 'Squid Router',
      protocolLink: undefined,
      srcToken,
      srcAmount,
      destToken,
      destAmount,
    };
  }

  return undefined;
};

const mapSquidStatus = (status: SquidSdkStatusResponse | undefined): SwapStatus => {
  switch (status?.status) {
    case undefined:
      return 'waiting_for_src_tx';
    case 'source_gateway_called':
    case 'express_executed':
    case 'executing':
    case 'destination_gateway_approved':
      return 'waiting_for_dest_tx';
    case 'destination_executed':
      return 'completed';
    case 'error':
      return 'failed';
    case 'error_fetching_status':
    default:
      return 'unknown';
  }
};

export class SquidIntegration implements BaseIntegration {
  private constructor(readonly sdk: Squid) {}

  static async init() {
    const squid = new Squid({
      // https://docs.squidrouter.com/dev-resources/base-urls-and-other-links
      baseUrl: isTestnet
        ? 'https://testnet.v2.api.squidrouter.com'
        : 'https://v2.api.squidrouter.com',
      integratorId: 'chainflip-sdk',
    });
    await squid.init();
    return new SquidIntegration(squid);
  }

  readonly name = 'Squid';

  readonly logo = SquidLogo;

  getChains = async () => {
    const { chains } = this.sdk;

    return chains
      .map((chain) => chainById(mapSquidChainId(chain.chainType, chain.chainId)))
      .filter(isTruthy);
  };

  getDestinationChains = async (srcChainId: ChainId) => {
    const squidChainId = mapChainIdToSquid(srcChainId);
    if (!squidChainId) return [];

    const chains = await this.getChains();
    return chains.filter((chain) => chain.id !== srcChainId);
  };

  getTokens = async (chainId: ChainId) => {
    const { tokens } = this.sdk;
    const squidChainId = mapChainIdToSquid(chainId);

    const chainTokens = tokens.filter((token) => token.chainId === squidChainId);

    return chainTokens.map(mapSquidToken);
  };

  getRoutes = async (routeParams: RouteRequest) => {
    if (routeParams.srcChainId === routeParams.destChainId) return []; // squid does not support same chain swaps (27th July 2023)
    const srcChainId = mapChainIdToSquid(routeParams.srcChainId);
    const destChainId = mapChainIdToSquid(routeParams.destChainId);
    if (!srcChainId || !destChainId) return [];

    const params: SquidSdkRouteRequest = {
      fromChain: srcChainId,
      toChain: destChainId,
      fromToken: mapTokenAddressToSquid(routeParams.srcTokenAddress),
      toToken: mapTokenAddressToSquid(routeParams.destTokenAddress),
      fromAmount: routeParams.amount.toString(),
      fromAddress: ZERO_EVM_ADDRESS, // replaced by address of connected wallet in executeSwap
      toAddress: routeParams.destAddress || ZERO_EVM_ADDRESS,
      slippageConfig: {
        slippage: SQUID_DEFAULT_SLIPPAGE,
        autoMode: SquidSdkSlippageMode.NORMAL,
      },
    };

    let route;
    try {
      ({ route } = await this.sdk.getRoute(params));
    } catch (error) {
      // TODO: handle expected errors from squid without logging an error

      // eslint-disable-next-line no-console
      console.error('failed to load route from squid', error);
      return [];
    }

    const srcToken = mapSquidToken(route.estimate.fromToken);
    const destToken = mapSquidToken(route.estimate.toToken);

    const platformFees = route.estimate.feeCosts.map((fee) => ({
      name: fee.name,
      token: mapSquidToken(fee.token),
      amount: new TokenAmount(fee.amount, fee.token.decimals),
    }));
    const gasFees = route.estimate.gasCosts.map((fee) => ({
      token: mapSquidToken(fee.token),
      amount: new TokenAmount(fee.amount, fee.token.decimals),
    }));
    const steps = route.estimate.actions.map(mapSquidAction).filter(isTruthy);

    const routeResponse = {
      integration: 'squid' as const,
      integrationData: route,
      srcToken,
      srcAmount: new TokenAmount(route.estimate.fromAmount, srcToken.decimals),
      destToken,
      destAmount: new TokenAmount(route.estimate.toAmount, destToken.decimals),
      steps,
      gasFees,
      platformFees,
      durationSeconds: route.estimate.estimatedRouteDuration,
    };

    return [{ ...routeResponse, id: getDeterministicRouteId(routeResponse) }];
  };

  executeSwap = async (swapId: string, walletClient: WalletClient) => {
    const route = loadRouteFromLocalStorage('squid', swapId);
    if (!route || route.integration !== 'squid') {
      throw new Error(`route for swap "${swapId}" not found`);
    }

    // re-request route from squid to make sure squid calldata matches connected wallet
    const signer = walletClientToEthersV5Signer(walletClient);
    const squidRoute = await this.sdk.getRoute({
      ...route.integrationData.params,
      fromAddress: await signer.getAddress(),
    });
    route.integrationData = squidRoute.route;

    const response: ExecuteSwapResponse = {
      integration: 'squid' as const,
      integrationData: undefined,
      error: undefined,
    };

    const sdkResponse = await this.sdk.executeRoute({
      route: route.integrationData,
      signer,
    });
    assert('hash' in sdkResponse, 'missing hash in squid sdk response');
    response.integrationData = sdkResponse.hash;
    storeTransactionHashInLocalStorage('squid', swapId, sdkResponse.hash);

    try {
      await client.post('third-party-swap', {
        uuid: swapId,
        routeResponse: route,
        txHash: sdkResponse.hash,
        txLink: '',
      });
    } catch (err) {
      response.error = JSON.stringify(err);
    }

    return response;
  };

  getStatus = async (swapId: string) => {
    let route = loadRouteFromLocalStorage('squid', swapId);

    try {
      if (!route) {
        const response = await client.get<{
          routeResponse: SquidRouteResponse;
          txHash: string;
        }>(`third-party-swap/${swapId}`);
        route = {
          ...response.data.routeResponse,
          transactionHash: response.data.txHash,
        };
      }
    } catch (e) {
      // ignore: swap is only stored after tx execution
      if (!(isAxiosError(e) && e.response?.status === 404)) throw e;
    }

    if (!route || route.integration !== 'squid') {
      return undefined;
    }

    let squidStatus: SquidSdkStatusResponse | undefined;
    if (route.transactionHash) {
      try {
        squidStatus = await this.sdk.getStatus({
          transactionId: route.transactionHash,
        });
      } catch (e) {
        // ignore: tx is not immediately found
        if (!(isAxiosError(e) && e.response?.status === 404)) throw e;
      }
    }

    const eventLogs: EventLog[] = [];
    const statusOrder = squidLogMap[mapSquidStatus(squidStatus)]?.order;

    for (const item of Object.values(squidLogMap)) {
      if (route.transactionHash) {
        if (!statusOrder || item.order <= statusOrder) {
          const FromChainLogo =
            squidStatus?.fromChain &&
            chainTransparentLogo[
              mapSquidChainId(
                squidStatus.fromChain.chainData.chainType,
                squidStatus.fromChain.chainData.chainId,
              )
            ];

          eventLogs.unshift({
            logo: item.order === 0 ? FromChainLogo : AxelarLogo,
            message: item.message,
            link:
              item.order > 0
                ? squidStatus?.axelarTransactionUrl
                : squidStatus?.fromChain?.transactionUrl,
            status: item.order === statusOrder && item.order < 3 ? 'processing' : 'success',
          });
        }
      }
      if (!statusOrder) break; // if we get a failed, refunded or unknown only show the tx event
    }

    return {
      id: swapId,
      shareableId: squidStatus ? swapId : undefined,
      integration: 'squid' as const,
      integrationData: squidStatus,
      route,
      status: mapSquidStatus(squidStatus),
      swapExplorerUrl: squidStatus?.axelarTransactionUrl,
      eventLogs,
      srcToken: route.srcToken,
      srcAmount: new TokenAmount(route.srcAmount, route.srcToken.decimals),
      depositAddress: undefined,
      srcTransactionHash: route.transactionHash,
      srcConfirmationCount: undefined,
      destToken: route.destToken,
      destAddress: route.integrationData.params.toAddress,
      destAmount: new TokenAmount(route.destAmount, route.destToken.decimals),
      destTransactionHash: squidStatus?.toChain?.transactionId,
      duration: squidStatus?.timeSpent?.total,
    };
  };
}
