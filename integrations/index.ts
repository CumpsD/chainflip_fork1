import {
  type RouteResponse as SquidRoute,
  type StatusResponse as SquidStatus,
} from '@0xsquid/sdk/dist/types';
import type {
  DepositAddressRequest as ChainflipDepositAddressRequest,
  SwapStatusResponse as ChainflipStatus,
} from '@chainflip/sdk/swap';
// import {
//   type Route as LifiRoute,
//   type StatusResponse as LifiStatus,
// } from '@lifi/sdk';
import { type ChainId } from '@/shared/assets/chains';
import { type ChainflipToken, type Token } from '@/shared/assets/tokens';
import { type TokenAmount } from '@/shared/utils';
import { ChainflipIntegration } from './chainflip';
// import { LifiIntegration } from './lifi';
import { IntegrationManager } from './manager';
import { SquidIntegration } from './squid';

type TransactionHash = string;

const integrations = [
  'chainflip',
  // 'lifi',
  'squid',
] as const;
export type Integration = (typeof integrations)[number];

export const isSupportedIntegration = (
  integration: string | string[] | undefined,
): integration is Integration => integrations.includes(integration as Integration);

const swapStates = [
  'waiting_for_src_tx',
  'waiting_for_src_tx_confirmation',
  'waiting_for_dest_tx',
  'completed',
  'refunded',
  'failed',
  'unknown', // integration api or rpc is not reachable
] as const;
export type SwapStatus = (typeof swapStates)[number];

export interface RouteRequest {
  srcChainId: ChainId;
  destChainId: ChainId;
  srcTokenAddress: string;
  destTokenAddress: string;
  amount: bigint;
  destAddress: string | undefined;
}
export interface RouteResponseStep<T extends Token = Token> {
  protocolName: string;
  protocolLink: string | undefined;
  srcToken: T;
  srcAmount: TokenAmount;
  destToken: T;
  destAmount: TokenAmount;
}

interface BaseRouteResponse<I extends Integration, Data, T extends Token = Token> {
  id: string;
  integration: I;
  integrationData: Data;
  srcToken: T;
  srcAmount: TokenAmount;
  destToken: T;
  destAmount: TokenAmount;
  steps: RouteResponseStep<T>[];
  gasFees: { token: T; amount: TokenAmount }[];
  platformFees: { name: string; token: T; amount: TokenAmount }[];
  durationSeconds: number;
}

export type ChainflipRouteResponse = BaseRouteResponse<
  'chainflip',
  ChainflipDepositAddressRequest,
  ChainflipToken
>;
export type SquidRouteResponse = BaseRouteResponse<'squid', SquidRoute['route']>;
// export type LifiRouteResponse = BaseRouteResponse<'lifi', LifiRoute>;

export type RouteResponse =
  | ChainflipRouteResponse
  // | LifiRouteResponse
  | SquidRouteResponse;

interface BaseStatusResponse<I extends Integration, Data, T extends Token = Token> {
  id: string;
  shareableId: string | undefined;
  integration: I;
  integrationData: Data;
  route: RouteResponse;
  status: SwapStatus;
  eventLogs: EventLog[];
  srcToken: T;
  srcAmount: TokenAmount;
  depositAddress: string | undefined;
  srcTransactionHash: string | undefined;
  srcConfirmationCount: number | undefined;
  destToken: T;
  destAddress: string | undefined;
  destAmount: TokenAmount;
  destTransactionHash: string | undefined;
  duration: number | undefined;
  swapExplorerUrl: string | undefined;
}

export type ChainflipStatusResponse = BaseStatusResponse<
  'chainflip',
  ChainflipStatus | undefined,
  ChainflipToken
>;

export type SquidStatusResponse = BaseStatusResponse<'squid', SquidStatus | undefined>;
// export type LifiStatusResponse = BaseStatusResponse<
//   'lifi',
//   LifiStatus | undefined
// >;

export type StatusResponse =
  | ChainflipStatusResponse
  // | LifiStatusResponse
  | SquidStatusResponse;

export type PrepareSwapResponse = {
  integration: Integration;
  id: string;
};

export type ExecuteSwapResponse = {
  integration: Integration;
  integrationData: TransactionHash | undefined;
  error: string | undefined;
};

export interface EventLog {
  logo: ((props?: React.SVGProps<SVGSVGElement>) => JSX.Element) | undefined;
  message: string;
  link: string | undefined;
  linkTitle?: string;
  status: 'success' | 'error' | 'processing';
}

export const integrationManager = IntegrationManager.from({
  chainflip: new ChainflipIntegration(),
  // lifi: new LifiIntegration(),
  squid: SquidIntegration.init(),
});
