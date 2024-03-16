import { isTestnet } from '@/shared/featureFlags';
import { type ChainflipAsset, type UncheckedAssetAndChain } from '@/shared/utils/chainflip';
import { NATIVE_TOKEN_ADDRESS } from './constants';
import mainnet from './mainnet';
import testnet from './testnet';
import { type Chain, chainById, type ChainId, type ChainflipChain } from '../chains';

export interface Token {
  chain: Chain;
  address: string;
  name: string;
  symbol: string;
  /** the symbol from the deployed contract */
  canonicalSymbol?: string;
  decimals: number;
  logo?: string;
}

export interface ChainflipToken extends Token {
  chain: ChainflipChain;
  chainflipId: ChainflipAsset;
}

export function isChainflipTokenOrChain(token: Token | undefined): token is ChainflipToken;
export function isChainflipTokenOrChain(chain: Chain | undefined): chain is ChainflipChain;
export function isChainflipTokenOrChain(obj: Token | Chain | undefined) {
  if (!obj) return false;
  return 'chainflipId' in obj;
}

export const tokens: Token[] = isTestnet ? testnet : mainnet;

export const tokenByAddress = (
  chainId: ChainId,
  address: string,
  logo: string | undefined,
  fallbackInformation: Pick<Token, 'name' | 'symbol' | 'decimals'>,
): Token => {
  const knownToken = tokens.find(
    (token) => token.chain.id === chainId && token.address.toLowerCase() === address.toLowerCase(),
  );
  if (knownToken) return knownToken;

  const chain = chainById(chainId);
  if (!chain) {
    throw new Error(`chain "${chainId}" not found`);
  }

  return {
    chain,
    address,
    logo,
    ...fallbackInformation,
  };
};

export const tokenToUncheckedAsset = (token: ChainflipToken): UncheckedAssetAndChain => ({
  asset: token.chainflipId,
  chain: token.chain.chainflipId,
});

export * from './mainnet';
export * from './testnet';

export const isWatchable = (token: Token) =>
  token.chain.id.startsWith('evm-') && token.address !== NATIVE_TOKEN_ADDRESS;
