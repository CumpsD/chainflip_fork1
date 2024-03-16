import { type Chain as WagmiChain } from 'wagmi';
import * as wagmiChains from 'wagmi/chains';
import { type Chain, type ChainflipChain } from '.';

export const bitcoin = {
  id: 'btc',
  name: 'Bitcoin',
  addressPlaceholder: '',
  wagmiChain: undefined,
  chainflipId: 'Bitcoin',
} satisfies ChainflipChain;

export const ethereum = {
  id: 'evm-1',
  name: 'Ethereum',
  addressPlaceholder: '0x...',
  wagmiChain: wagmiChains.mainnet as WagmiChain,
  chainflipId: 'Ethereum',
} satisfies ChainflipChain;

export const polkadot = {
  id: 'dot',
  name: 'Polkadot',
  addressPlaceholder: '1...',
  wagmiChain: undefined,
  chainflipId: 'Polkadot',
} satisfies ChainflipChain;

export const polygon = {
  id: 'evm-137',
  name: 'Polygon',
  addressPlaceholder: '0x...',
  wagmiChain: wagmiChains.polygon as WagmiChain,
} satisfies Chain;

export const arbitrum = {
  id: 'evm-42161',
  name: 'Arbitrum',
  addressPlaceholder: '0x...',
  wagmiChain: wagmiChains.arbitrum as WagmiChain,
} satisfies Chain;

export const optimism = {
  id: 'evm-10',
  name: 'Optimism',
  addressPlaceholder: '0x...',
  wagmiChain: wagmiChains.optimism as WagmiChain,
} satisfies Chain;

export const avalanche = {
  id: 'evm-43114',
  name: 'Avalanche',
  addressPlaceholder: '0x...',
  wagmiChain: wagmiChains.avalanche as WagmiChain,
} satisfies Chain;

export const moonbeam = {
  id: 'evm-1284',
  name: 'Moonbeam',
  addressPlaceholder: '0x...',
  wagmiChain: wagmiChains.moonbeam as WagmiChain,
} satisfies Chain;

export const filecoin = {
  id: 'evm-314',
  name: 'Filecoin',
  addressPlaceholder: '0x...',
  wagmiChain: wagmiChains.filecoin as WagmiChain,
} satisfies Chain;

export const bsc = {
  id: 'evm-56',
  name: 'Binance Smart Chain',
  addressPlaceholder: '0x...',
  wagmiChain: wagmiChains.bsc as WagmiChain,
} satisfies Chain;

export const fantom = {
  id: 'evm-250',
  name: 'Fantom',
  addressPlaceholder: '0x...',
  wagmiChain: wagmiChains.fantom as WagmiChain,
} satisfies Chain;

export const celo = {
  id: 'evm-42220',
  name: 'Calo',
  addressPlaceholder: '0x...',
  wagmiChain: wagmiChains.celo as WagmiChain,
} satisfies Chain;

export default [
  bitcoin,
  ethereum,
  polkadot,
  polygon,
  arbitrum,
  optimism,
  avalanche,
  moonbeam,
  filecoin,
  bsc,
  fantom,
  celo,
];
