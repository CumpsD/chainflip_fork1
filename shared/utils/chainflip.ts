import { BitcoinLogo, EthereumLogo, PolkadotLogo } from '@/shared/assets/chain-logos';
import {
  BitcoinTransparentLogo,
  EthereumTransparentLogo,
  PolkadotTransparentLogo,
} from '@/shared/assets/chain-transparent-logos';
import { BtcLogo, DotLogo, EthLogo, FlipLogo, UsdcLogo } from '@/shared/assets/token-logos';
import { isTestnet } from '@/shared/featureFlags';
import { toUpperCase } from '@/shared/utils/strings';
import { unreachable } from './guards';
import { etherscanUrl } from './helpers';

export const chainflipAssets = ['Eth', 'Flip', 'Usdc', 'Btc', 'Dot'] as const;
export type ChainflipAsset = (typeof chainflipAssets)[number];
export const baseChainflipAssets = ['Eth', 'Flip', 'Btc', 'Dot'] as const;
export type BaseChainflipAsset = (typeof baseChainflipAssets)[number];
export const chainflipChains = ['Bitcoin', 'Ethereum', 'Polkadot'] as const;
export type ChainflipChain = (typeof chainflipChains)[number];

export const assetToChainMap: Record<ChainflipAsset, ChainflipChain> = {
  Dot: 'Polkadot',
  Eth: 'Ethereum',
  Flip: 'Ethereum',
  Usdc: 'Ethereum',
  Btc: 'Bitcoin',
};

export const chainToAssetsMap: Record<ChainflipChain, ChainflipAsset[]> = {
  Bitcoin: ['Btc'],
  Polkadot: ['Dot'],
  Ethereum: ['Eth', 'Usdc', 'Flip'],
};

export const chainToNativeAssetMap: Record<ChainflipChain, ChainflipAsset> = {
  Bitcoin: 'Btc',
  Polkadot: 'Dot',
  Ethereum: 'Eth',
};

export const buildExplorerLink = (
  chain: ChainflipChain,
  type: 'address' | 'block',
  value: string | number,
): string => {
  const blockstreamUrl = `https://blockstream.info${isTestnet ? '/testnet' : ''}`;

  switch (chain) {
    case 'Bitcoin':
      if (type === 'block') {
        return `${blockstreamUrl}/block-height/${value}?q=${value}`;
      }
      if (type === 'address') {
        return `${blockstreamUrl}/address/${value}`;
      }
      return unreachable(type, 'unhandled link type');
    case 'Polkadot':
      if (type === 'block') return `https://polkadot.subscan.io/block/${value}`;
      if (type === 'address') {
        return `https://polkadot.subscan.io/account/${value}`;
      }
      return unreachable(type, 'unhandled link type');
    case 'Ethereum':
      if (type === 'block') return `${etherscanUrl()}/block/${value}`;
      if (type === 'address') return `${etherscanUrl()}/address/${value}`;
      return unreachable(type, 'unhandled link type');
    default:
      return unreachable(chain, 'unhandled chain');
  }
};

export const chainToLogoMap: Record<
  ChainflipChain,
  (props?: React.SVGProps<SVGSVGElement>) => JSX.Element
> = {
  Bitcoin: BitcoinLogo,
  Polkadot: PolkadotLogo,
  Ethereum: EthereumLogo,
};

export const poolToColorMap: Record<BaseChainflipAsset, string> = {
  Btc: '#FFD2A8',
  Dot: '#FF33AF',
  Eth: '#268AFF',
  Flip: '#FFFFFF',
};

export const assetToLogoMap: Record<
  ChainflipAsset,
  (props?: React.SVGProps<SVGSVGElement>) => JSX.Element
> = {
  Dot: DotLogo,
  Eth: EthLogo,
  Flip: FlipLogo,
  Usdc: UsdcLogo,
  Btc: BtcLogo,
};

export const chainToTransparentLogoMap: Record<
  ChainflipChain,
  (props?: React.SVGProps<SVGSVGElement>) => JSX.Element
> = {
  Bitcoin: BitcoinTransparentLogo,
  Ethereum: EthereumTransparentLogo,
  Polkadot: PolkadotTransparentLogo,
};

export type ChainAssetMap<T> = {
  Bitcoin: {
    BTC: T;
  };
  Ethereum: {
    ETH: T;
    USDC: T;
    FLIP: T;
  };
  Polkadot: {
    DOT: T;
  };
};

export type BaseChainAssetMap<T> = {
  Bitcoin: {
    BTC: T;
  };
  Ethereum: {
    ETH: T;
    FLIP: T;
  };
  Polkadot: {
    DOT: T;
  };
};

export type UncheckedAssetAndChain = {
  asset: ChainflipAsset;
  chain: ChainflipChain;
};

export type BaseUncheckedAssetAndChain = {
  asset: BaseChainflipAsset;
  chain: ChainflipChain;
};

// a ChainAssetMap can be safely used with quote or base assets
export function readAssetValue<T>(
  map: ChainAssetMap<T>,
  asset: UncheckedAssetAndChain | BaseUncheckedAssetAndChain,
): T;
// a BaseChainAssetMap can only be safely used with base assets
export function readAssetValue<T>(map: BaseChainAssetMap<T>, asset: BaseUncheckedAssetAndChain): T;
// a BaseChainAssetMap can only be safely used with base assets
export function readAssetValue<T>(
  map: ChainAssetMap<T> | BaseChainAssetMap<T>,
  asset: BaseUncheckedAssetAndChain,
): T;
export function readAssetValue<T>(
  map: ChainAssetMap<T> | BaseChainAssetMap<T>,
  asset: UncheckedAssetAndChain | BaseUncheckedAssetAndChain,
): T {
  const chainValues = map[asset.chain];
  return chainValues[toUpperCase(asset.asset) as keyof typeof chainValues];
}
