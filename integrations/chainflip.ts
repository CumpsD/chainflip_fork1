import {
  SwapSDK as ChainflipSDK,
  getChainflipId,
  type Chain as ChainflipChain,
  type Asset as ChainflipAsset,
  type SwapStatusResponse as ChainflipSwapStatusResponse,
  type DepositAddressRequest as ChainflipDepositAddressRequest,
  type ChainflipNetwork,
  type QuoteResponse,
} from '@chainflip/sdk/swap'
import { isAxiosError } from 'axios'
import { ethers } from 'ethers'
import { TransactionResponse } from 'ethers'

// import { type TransactionResponse } from 'ethers/src.ts/providers/provider'
import { erc20ABI, type WalletClient } from 'wagmi'
import { getPublicClient } from 'wagmi/actions'
import {
  chainById,
  type ChainId,
  parseEvmChainId,
} from '@/shared/assets/chains'
import ChainflipMonochromaticLogo from '@/shared/assets/svg/monochromatic-logos/cf'
import { FlipLogo } from '@/shared/assets/token-logos'
import {
  isChainflipTokenOrChain,
  type ChainflipToken,
} from '@/shared/assets/tokens'
import { NATIVE_TOKEN_ADDRESS } from '@/shared/assets/tokens/constants'
import { walletClientToEthersV6Signer } from '@/shared/hooks/useEthersSigner'
import {
  TokenAmount,
  isTruthy,
  isHash,
  isNullish,
  abbreviate,
  chainflipChainMap,
  chainflipAssetMap,
  mapTokenToChainflipAsset,
  getChainflipNetwork,
  toUpperCase,
} from '@/shared/utils'
import { readAssetValue } from '@/shared/utils/chainflip'
import { type BaseIntegration, getDeterministicRouteId } from './manager'
import {
  loadRouteFromLocalStorage,
  storeDepositChannelIdInLocalStorage,
  storeRouteInLocalStorage,
} from './storage'
import {
  BROKER_FEE,
  EGRESS_FEE,
  INGRESS_FEE,
  NETWORK_FEE,
  POOL_FEE,
} from '../utils/consts'
import {
  type ChainflipRouteResponse,
  type ChainflipStatusResponse,
  type EventLog,
  type RouteRequest,
  type RouteResponse,
  type RouteResponseStep,
  type SwapStatus,
} from '.'

type ChainflipApproveVaultParams = Parameters<ChainflipSDK['approveVault']>[0]
type ChainflipExecuteSwapParams = Parameters<ChainflipSDK['executeSwap']>[0]
type SwapFee = QuoteResponse['quote']['includedFees'][number]

const swapFeeNameMap: Record<SwapFee['type'], string> = {
  LIQUIDITY: POOL_FEE,
  NETWORK: NETWORK_FEE,
  INGRESS: INGRESS_FEE,
  EGRESS: EGRESS_FEE,
  BROKER: BROKER_FEE,
}

const depositChannelIdRegex =
  /^(?<issuedBlock>\d+)-(?<srcChain>[a-z]+)-(?<channelId>\d+)$/i
const transactionHashRegex = /^0x[a-f\d]+$/i

const chainflipStatusMap: Record<
  ChainflipSwapStatusResponse['state'],
  SwapStatus | undefined
> = {
  AWAITING_DEPOSIT: 'waiting_for_src_tx',
  DEPOSIT_RECEIVED: 'waiting_for_dest_tx',
  SWAP_EXECUTED: 'waiting_for_dest_tx',
  EGRESS_SCHEDULED: 'waiting_for_dest_tx',
  BROADCAST_REQUESTED: 'waiting_for_dest_tx',
  BROADCASTED: 'completed',
  BROADCAST_ABORTED: 'failed',
  FAILED: 'failed',
  COMPLETE: 'completed',
} as const

export const mapChainIdToChainflip = (
  chainId: ChainId
): ChainflipChain | undefined => {
  const chain = chainById(chainId)

  return isChainflipTokenOrChain(chain) ? chain.chainflipId : undefined
}

const mapChainflipChain = (chainflipChain: ChainflipChain): ChainId =>
  chainflipChainMap[chainflipChain].id

const mapChainflipAsset = (
  chainflipChain: ChainflipChain,
  chainflipAsset: ChainflipAsset
): ChainflipToken => {
  const ID: string = getChainflipId({
    asset: chainflipAsset,
    chain: chainflipChain,
  })

  // return chainflipAssetMap[ID]
  return chainflipAssetMap[ID as keyof typeof chainflipAssetMap]
}

const mapChainflipStatus = (
  chainflipStatus: ChainflipSwapStatusResponse['state']
): SwapStatus => chainflipStatusMap[chainflipStatus] ?? 'unknown'

const Logo = () => ChainflipMonochromaticLogo({ style: { scale: '80%' } })

const buildEventLog = (
  sdkStatus: ChainflipSwapStatusResponse,
  route: RouteResponse,
  depositChannelId: string | undefined,
  depositTransactionConfirmations: number | undefined
): EventLog[] => {
  const pastEvents: EventLog[] = []
  const srcAmountWithSymbol = `${route.srcAmount.toPreciseFixedDisplay()} ${
    route.srcToken.symbol
  }`
  const destAmountWithSymbol = `${route.destAmount.toPreciseFixedDisplay()} ${
    route.destToken.symbol
  }`
  const abbreviatedDestAddress = abbreviate(sdkStatus.destAddress)

  if (depositChannelId) {
    pastEvents.push({
      message: 'Deposit address created',
      status: 'success',
      linkTitle: 'View on Explorer',
      logo: Logo,
      link: `${process.env.NEXT_PUBLIC_EXPLORER_URL}/channels/${depositChannelId}`,
    })
  }

  if ('depositReceivedBlockIndex' in sdkStatus) {
    pastEvents.push({
      message: `${srcAmountWithSymbol} deposited`,
      status: 'success',
      logo: Logo,
      link: `${process.env.NEXT_PUBLIC_EXPLORER_URL}/events/${sdkStatus.depositReceivedBlockIndex}`,
    })

    if (sdkStatus.swapId) {
      pastEvents.push({
        message: `Swap scheduled`,
        status: 'success',
        linkTitle: 'View on Explorer',
        logo: Logo,
        link: `${process.env.NEXT_PUBLIC_EXPLORER_URL}/swaps/${sdkStatus.swapId}`,
      })
    }
  } else {
    let message
    if (!depositTransactionConfirmations) {
      message = 'Waiting to receive your funds'
    } else if (depositTransactionConfirmations >= 6) {
      message = 'Waiting for witnessing to complete'
    } else {
      message = 'Waiting for block confirmations'
    }

    return [
      ...pastEvents,
      {
        message,
        status: 'processing',
        logo: Logo,
        link: undefined,
      },
    ]
  }

  if ('swapExecutedBlockIndex' in sdkStatus) {
    pastEvents.push({
      message: `Swapped ${srcAmountWithSymbol} for ${destAmountWithSymbol} successfully`,
      status: 'success',
      logo: Logo,
      link: `${process.env.NEXT_PUBLIC_EXPLORER_URL}/events/${sdkStatus.swapExecutedBlockIndex}`,
    })
  } else {
    return [
      ...pastEvents,
      {
        message: `Preparing to swap ${srcAmountWithSymbol} for ${destAmountWithSymbol}`,
        status: 'processing',
        logo: Logo,
        link: undefined,
      },
    ]
  }

  if ('egressScheduledBlockIndex' in sdkStatus) {
    pastEvents.push({
      message: `Requesting to send ${destAmountWithSymbol} to the destination address ${abbreviatedDestAddress}`,
      status: 'success',
      logo: Logo,
      link: `${process.env.NEXT_PUBLIC_EXPLORER_URL}/events/${sdkStatus.egressScheduledBlockIndex}`,
    })
  }

  if ('broadcastSucceededBlockIndex' in sdkStatus) {
    pastEvents.push({
      message: `${destAmountWithSymbol} sent to address ${abbreviatedDestAddress}`,
      status: 'success',
      logo: Logo,
      link: `${process.env.NEXT_PUBLIC_EXPLORER_URL}/events/${sdkStatus.broadcastSucceededBlockIndex}`,
    })
  } else if (
    'broadcastAbortedBlockIndex' in sdkStatus ||
    sdkStatus.state === 'FAILED'
  ) {
    const index =
      'broadcastAbortedBlockIndex' in sdkStatus
        ? sdkStatus.broadcastAbortedBlockIndex
        : sdkStatus.egressIgnoredBlockIndex
    pastEvents.push({
      message: `Contact us in this channel with the number ${sdkStatus.swapId} to resolve the issue`,
      status: 'error',
      logo: Logo,
      link: `${process.env.NEXT_PUBLIC_EXPLORER_URL}/events/${index}`,
    })
  } else if ('broadcastRequestedBlockIndex' in sdkStatus) {
    pastEvents.push({
      message: `Sending ${destAmountWithSymbol} to the destination address ${abbreviatedDestAddress}`,
      status: 'processing',
      logo: Logo,
      link: undefined,
    })
  }

  return pastEvents
}

const buildRouteObject = (
  swapData: ChainflipDepositAddressRequest,
  quote: {
    intermediateAmount?: string
    egressAmount: string
    fees: SwapFee[]
    estimatedDurationSeconds: number
  }
): ChainflipRouteResponse => {
  const srcToken = mapChainflipAsset(swapData.srcChain, swapData.srcAsset)
  const srcAmount = new TokenAmount(swapData.amount, srcToken.decimals)
  const destToken = mapChainflipAsset(swapData.destChain, swapData.destAsset)
  const destAmount = new TokenAmount(quote.egressAmount, destToken.decimals)

  const intermediateUsdcAmount = quote.intermediateAmount
    ? new TokenAmount(quote.intermediateAmount, chainflipAssetMap.Usdc.decimals)
    : undefined

  const steps: RouteResponseStep<ChainflipToken>[] = intermediateUsdcAmount
    ? [
        {
          protocolName: 'Chainflip',
          protocolLink: undefined,
          srcToken,
          srcAmount,
          destAmount: intermediateUsdcAmount,
          destToken: chainflipAssetMap.Usdc,
        },
        {
          protocolName: 'Chainflip',
          protocolLink: undefined,
          srcToken: chainflipAssetMap.Usdc,
          srcAmount: intermediateUsdcAmount,
          destToken,
          destAmount,
        },
      ]
    : [
        {
          protocolName: 'Chainflip',
          protocolLink: undefined,
          srcToken,
          srcAmount,
          destToken,
          destAmount,
        },
      ]

  const platformFees = quote.fees.map((fee) => {
    const token = mapChainflipAsset(fee.chain, fee.asset)

    return {
      name: swapFeeNameMap[fee.type],
      token,
      amount: new TokenAmount(fee.amount, token.decimals),
    }
  })

  const routeResponse = {
    integration: 'chainflip' as const,
    integrationData: {
      ...swapData,
    },
    srcToken,
    srcAmount,
    destToken,
    destAmount,
    steps,
    gasFees: [],
    platformFees,
    durationSeconds: quote.estimatedDurationSeconds,
  }

  return { ...routeResponse, id: getDeterministicRouteId(routeResponse) }
}

const transactionHashKey = (swapId: string) =>
  `chainflip-deposit-transaction-${swapId}`

const storeTransactionHashInLocalStorage = (swapId: string, txHash: string) => {
  localStorage.setItem(transactionHashKey(swapId), txHash)
}
const loadTransactionHashFromLocalStorage = (
  swapId: string
): string | undefined =>
  localStorage.getItem(transactionHashKey(swapId)) ?? undefined

const addEventListener = (handler: (ev: PromiseRejectionEvent) => void) => {
  window.addEventListener('unhandledrejection', handler)

  return () => {
    window.removeEventListener('unhandledrejection', handler)
  }
}

const deferredPromise = <T>() => {
  let resolve: (value: T | PromiseLike<T>) => void
  let reject: (reason?: unknown) => void

  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return { promise, resolve: resolve!, reject: reject! }
}

const getHashFromMetamaskError = () => {
  const { promise, resolve } = deferredPromise<string>()

  const remove = addEventListener((ev) => {
    if (ev.reason?.code === 'INVALID_ARGUMENT') {
      const { hash } = ev.reason.value
      if (typeof hash === 'string') {
        resolve(hash)
      }
    }
  })

  return { promise, remove }
}

export class ChainflipIntegration implements BaseIntegration {
  sdk = new ChainflipSDK({
    network: getChainflipNetwork() as ChainflipNetwork,
    backendUrl: process.env.NEXT_PUBLIC_CHAINFLIP_BACKEND_URL,
  })

  readonly name = 'Chainflip'

  readonly logo = FlipLogo

  getChains = async () => {
    const sdkChains = await this.sdk.getChains()

    // console.log('===================SDK CHAINS : ', sdkChains)

    return sdkChains
      .map((chain) => chainById(mapChainflipChain(chain.chain)))
      .filter(isTruthy)
  }

  getDestinationChains = async (srcChainId: ChainId) => {
    const chainflipChain = mapChainIdToChainflip(srcChainId)
    if (!chainflipChain) return []

    const sdkChains = (await this.sdk.getChains(chainflipChain)) ?? []

    return sdkChains
      .map((chain) => chainById(mapChainflipChain(chain.chain)))
      .filter(isTruthy)
  }

  getRoutes = async (routeParams: RouteRequest) => {
    const srcChain = mapChainIdToChainflip(routeParams.srcChainId)
    const srcAsset = mapTokenToChainflipAsset(
      routeParams.srcChainId,
      routeParams.srcTokenAddress
    )
    const destChain = mapChainIdToChainflip(routeParams.destChainId)
    const destAsset = mapTokenToChainflipAsset(
      routeParams.destChainId,
      routeParams.destTokenAddress
    )
    const { minimumAmount, maximumAmount } = await this.getSwapLimits(
      routeParams.srcChainId,
      routeParams.srcTokenAddress
    )
    const { amount } = routeParams

    if (
      !srcChain ||
      !srcAsset ||
      !destChain ||
      !destAsset ||
      amount < minimumAmount ||
      (maximumAmount && amount > maximumAmount)
    ) {
      return []
    }

    const sdkQuote = await this.sdk.getQuote({
      srcChain,
      destChain,
      srcAsset: toUpperCase(srcAsset),
      destAsset: toUpperCase(destAsset),
      amount: amount.toString(),
    })

    return [
      buildRouteObject(
        { ...sdkQuote, destAddress: routeParams.destAddress as string },
        {
          ...sdkQuote.quote,
          fees: sdkQuote.quote.includedFees,
        }
      ),
    ]
  }

  getTokens = async (chainId: ChainId) => {
    const chainflipChain = mapChainIdToChainflip(chainId)

    if (!chainflipChain) return []

    const sdkAssets = await this.sdk.getAssets(chainflipChain)
    // console.log('=============== sdkAssets: ', sdkAssets)

    return sdkAssets.map((asset) => mapChainflipAsset(asset.chain, asset.asset))
  }

  async getSwapLimits(
    chainId: ChainId,
    tokenAddress: string
  ): Promise<{ maximumAmount: bigint | null; minimumAmount: bigint }> {
    const limits = await this.sdk.getSwapLimits()

    const chainflipChain = mapChainIdToChainflip(chainId)
    const chainflipAsset = mapTokenToChainflipAsset(chainId, tokenAddress)
    if (!chainflipChain || !chainflipAsset) {
      return { minimumAmount: 0n, maximumAmount: null }
    }
    const assetAndChain = { chain: chainflipChain, asset: chainflipAsset }

    return {
      minimumAmount: readAssetValue(limits.minimumSwapAmounts, assetAndChain),
      maximumAmount: readAssetValue(limits.maximumSwapAmounts, assetAndChain),
    }
  }

  getStatus = async (
    swapId: string
  ): Promise<ChainflipStatusResponse | undefined> => {
    const storedRoute = loadRouteFromLocalStorage('chainflip', swapId)
    const depositChannelId = depositChannelIdRegex.test(swapId)
      ? swapId
      : storedRoute?.depositChannelId
    const localTransactionHash = transactionHashRegex.test(swapId)
      ? swapId
      : loadTransactionHashFromLocalStorage(swapId)

    const shareableId = depositChannelId ?? localTransactionHash

    let sdkStatus: ChainflipSwapStatusResponse | undefined
    if (shareableId) {
      try {
        sdkStatus = await this.sdk.getStatus({ id: shareableId })
        // remove null and undefined properties from object to allow for "'property' in status" checks
        // TODO: make sure that the object returned by the sdk matches the exported types
        sdkStatus = Object.fromEntries(
          Object.entries(sdkStatus).filter(([, value]) => !isNullish(value))
        ) as ChainflipSwapStatusResponse
      } catch (e) {
        // ignore 404: sdk will return status of transaction hash only after deposit is witnessed
        if (!(isAxiosError(e) && e.response?.status === 404)) throw e
      }
    }

    let swapParams: ChainflipDepositAddressRequest

    if (sdkStatus && sdkStatus.state !== 'FAILED') {
      const srcAmount =
        'depositAmount' in sdkStatus && sdkStatus.depositAmount
          ? sdkStatus.depositAmount
          : sdkStatus.expectedDepositAmount ?? '0'

      swapParams = { ...sdkStatus, amount: srcAmount }
    } else if (sdkStatus?.state === 'FAILED') {
      // for smart contract failures, we don't know the destination
      if (!sdkStatus.destChain || !sdkStatus.destAsset) return undefined

      swapParams = {
        srcChain: sdkStatus.srcChain,
        destChain: sdkStatus.destChain,
        srcAsset: sdkStatus.srcAsset,
        destAsset: sdkStatus.destAsset,
        destAddress: sdkStatus.destAddress,
        amount: sdkStatus.depositAmount,
      }
    } else if (storedRoute && storedRoute.integration === 'chainflip') {
      swapParams = {
        ...storedRoute.integrationData,
        amount: storedRoute.srcAmount.toString(),
      }
    } else {
      return undefined
    }

    let intermediateAmount =
      sdkStatus &&
      'intermediateAmount' in sdkStatus &&
      sdkStatus.intermediateAmount
        ? sdkStatus.intermediateAmount
        : undefined
    let egressAmount =
      sdkStatus && 'egressAmount' in sdkStatus && sdkStatus.egressAmount
        ? sdkStatus.egressAmount
        : undefined
    let fees = sdkStatus && 'feesPaid' in sdkStatus ? sdkStatus.feesPaid : []
    let estimatedDurationSeconds = 0

    // get quote from sdk if amount is not locked in yet
    if (!egressAmount) {
      try {
        const sdkQuote = await this.sdk.getQuote(swapParams)
        if ('intermediateAmount' in sdkQuote.quote) {
          intermediateAmount = sdkQuote.quote.intermediateAmount
        }
        egressAmount = sdkQuote.quote.egressAmount
        fees = sdkQuote.quote.includedFees
        estimatedDurationSeconds = sdkQuote.quote.estimatedDurationSeconds
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('error while fetching quote from sdk:', e)
        egressAmount = '0'
      }
    }

    const route = buildRouteObject(swapParams, {
      intermediateAmount,
      egressAmount,
      fees,
      estimatedDurationSeconds,
    })

    const duration =
      sdkStatus &&
      'broadcastSucceededAt' in sdkStatus &&
      sdkStatus.depositChannelCreatedAt
        ? sdkStatus.broadcastSucceededAt - sdkStatus.depositChannelCreatedAt
        : undefined

    let srcTransactionHash
    if (sdkStatus && 'depositTransactionHash' in sdkStatus) {
      srcTransactionHash = sdkStatus.depositTransactionHash
    } else if (
      swapParams.srcChain === 'Ethereum' &&
      isHash(localTransactionHash)
    ) {
      srcTransactionHash = localTransactionHash
    }

    let srcConfirmationCount
    if (sdkStatus && 'depositTransactionConfirmations' in sdkStatus) {
      srcConfirmationCount = sdkStatus.depositTransactionConfirmations
    } else if (isHash(srcTransactionHash)) {
      try {
        srcConfirmationCount = Number(
          await getPublicClient({
            chainId: parseEvmChainId(route.srcToken.chain.id),
          }).getTransactionConfirmations({
            hash: srcTransactionHash,
          })
        )
      } catch (e) {
        // ignore in localnet
      }
    }

    let status = sdkStatus
      ? mapChainflipStatus(sdkStatus.state)
      : 'waiting_for_src_tx'
    if (status === 'waiting_for_src_tx' && srcConfirmationCount !== undefined) {
      status = 'waiting_for_src_tx_confirmation'
    }

    return {
      id: swapId,
      shareableId,
      integration: 'chainflip' as const,
      integrationData: sdkStatus,
      status,
      route,
      swapExplorerUrl: undefined,
      srcToken: route.srcToken,
      srcAmount: route.srcAmount,
      depositAddress: sdkStatus?.depositAddress,
      srcTransactionHash,
      srcConfirmationCount,
      destToken: route.destToken,
      destAddress: swapParams.destAddress,
      destAmount: route.destAmount,
      destTransactionHash: undefined,
      duration,
      eventLogs: sdkStatus
        ? buildEventLog(
            sdkStatus,
            route,
            depositChannelId,
            srcConfirmationCount
          ).reverse()
        : [],
    }
  }

  createDepositChannel = async (swapId: string) => {
    console.log('############## createDepositChannel ##############')

    const preparedRoute = loadRouteFromLocalStorage('chainflip', swapId)
    if (!preparedRoute || preparedRoute.integration !== 'chainflip') {
      throw new Error(`Invalid route when opening deposit channel`)
    }
    console.log(
      '############## createDepositChannel ##############',
      preparedRoute
    )

    const response = await this.sdk.requestDepositAddress(
      preparedRoute.integrationData
    )

    console.log('############## createDepositChannel ##############', response)

    storeDepositChannelIdInLocalStorage(
      'chainflip',
      swapId,
      response.depositChannelId
    )

    console.log('####################   ', response)

    return response
  }

  executeSwap = async (swapId: string, walletClient: WalletClient) => {
    const status = await this.getStatus(swapId)
    if (!status) {
      throw new Error(`Status of swap "${swapId}" not found`)
    }
    if (status.route.integration !== 'chainflip') {
      throw new Error(`Unexpected route when executing swap "${swapId}"`)
    }

    let transactionHash
    const signer = walletClientToEthersV6Signer(walletClient)

    if (status.depositAddress) {
      const { promise, remove } = getHashFromMetamaskError()

      const txPromise: Promise<TransactionResponse> =
        status.srcToken.address === NATIVE_TOKEN_ADDRESS
          ? signer.sendTransaction({
              value: status.srcAmount.toString(),
              to: status.depositAddress,
            })
          : new ethers.Contract(
              status.srcToken.address,
              erc20ABI,
              signer
            ).transfer(status.depositAddress, status.srcAmount.toString())

      const submittedTransaction = await Promise.race([
        txPromise,
        promise.then((hash) => ({ hash })),
      ]).finally(remove)

      transactionHash = submittedTransaction.hash
    } else {
      const sdkWithSigner = new ChainflipSDK({
        signer,
        backendUrl: process.env.NEXT_PUBLIC_CHAINFLIP_BACKEND_URL,
        network: getChainflipNetwork() as ChainflipNetwork,
      })
      if (status.srcToken.address !== NATIVE_TOKEN_ADDRESS) {
        const { promise, remove } = getHashFromMetamaskError()

        await Promise.race([
          sdkWithSigner.approveVault(
            {
              ...status.route.integrationData,
              amount: status.route.integrationData.amount,
            } as ChainflipApproveVaultParams,
            { wait: 1 }
          ),
          promise.then(async (hash) => {
            await signer.provider.waitForTransaction(hash, 1)
          }),
        ]).finally(remove)
      }

      const { promise, remove } = getHashFromMetamaskError()

      transactionHash = await Promise.race([
        sdkWithSigner.executeSwap({
          ...status.route.integrationData,
          amount: status.route.integrationData.amount,
        } as ChainflipExecuteSwapParams),
        promise,
      ]).finally(remove)
    }

    storeTransactionHashInLocalStorage(
      status.shareableId ?? status.id,
      transactionHash
    )
    // store route data as sdk will return status for transaction hash only after deposit was witnessed
    storeRouteInLocalStorage('chainflip', transactionHash, status.route)

    return {
      integration: 'chainflip' as const,
      integrationData: transactionHash,
      error: undefined,
    }
  }
}
