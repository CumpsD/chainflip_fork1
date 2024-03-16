import { type ChainflipAsset } from './utils/chainflip';

export const PENDING_REDEMPTION = 'PENDING_REDEMPTION';
export const CHAINFLIP_SWAP_LIMITS = 'CHAINFLIP_SWAP_LIMITS';
export const CHAINFLIP_BLOCK_CONFIRMATIONS = 'CHAINFLIP_BLOCK_CONFIRMATIONS';
export const ACCOUNT_POOL_ORDERS = 'ACCOUNT_POOL_ORDERS';

export const getAccountPoolOrderQueryKey = (
  baseAsset: ChainflipAsset,
  quoteAsset: ChainflipAsset,
  account: string,
) => [ACCOUNT_POOL_ORDERS, baseAsset, quoteAsset, account];

type ChainflipAccountId = `cF${string}`;

export const accountInfoRpcKey = (accountId: ChainflipAccountId | undefined) =>
  ['account_info', accountId] as const;
