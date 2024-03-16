import { type Chain as WagmiChain } from 'wagmi';
import { isTestnet } from '@/shared/featureFlags';
import { type ChainflipChain as ChainflipChainId } from '@/shared/utils/chainflip';
import mainnetChains from './mainnet';
import testnetChains from './testnet';

export type ChainId =
  | `evm-${number}`
  | `cosmos-${string}`
  | 'dot'
  | 'dot-testnet'
  | 'btc'
  | 'btc-testnet';

export interface Chain {
  id: ChainId;
  name: string;
  addressPlaceholder: string;
  wagmiChain: WagmiChain | undefined;
}

export interface ChainflipChain extends Chain {
  chainflipId: ChainflipChainId;
}

export const allChains = [...mainnetChains, ...testnetChains];
export const chains: (Chain | ChainflipChain)[] = isTestnet ? testnetChains : mainnetChains;

export const chainById = (id: ChainId): Chain | ChainflipChain | undefined =>
  chains.find((c) => c.id === id);

export const isEvmChain = (chainId?: ChainId): chainId is `evm-${number}` =>
  chainId !== undefined && /evm-\d+/.test(chainId);

export const parseEvmChainId = (chainId?: ChainId): number | undefined => {
  if (!isEvmChain(chainId)) return undefined;
  return Number(chainId.split('-')[1]);
};

export * from './mainnet';
export * from './testnet';
