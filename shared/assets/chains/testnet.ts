import { type Chain as WagmiChain } from 'wagmi';
import * as wagmiChains from 'wagmi/chains';
import { type Chain, type ChainflipChain } from '.';

export const bitcoinTestnet = {
  id: 'btc-testnet',
  name: 'Bitcoin Testnet',
  addressPlaceholder: '',
  wagmiChain: undefined,
  chainflipId: 'Bitcoin',
} satisfies ChainflipChain;

export const goerli = {
  id: 'evm-5',
  name: 'Goerli',
  addressPlaceholder: '0x...',
  wagmiChain: wagmiChains.goerli as WagmiChain,
  chainflipId: 'Ethereum',
} satisfies ChainflipChain;

export const backspinEthereum = {
  id: 'evm-10997',
  name: 'Backspin Ethereum',
  addressPlaceholder: '0x...',
  wagmiChain: {
    id: 10997,
    name: 'Backspin Ethereum',
    network: 'backspin-ethereum',
    nativeCurrency: {
      decimals: 18,
      name: 'Backspin Ether',
      symbol: 'bsETH',
    },
    rpcUrls: {
      public: { http: ['https://backspin-eth.staging/'] },
      default: { http: ['https://backspin-eth.staging/'] },
    },
    testnet: true,
  } as WagmiChain,
  chainflipId: 'Ethereum',
} satisfies ChainflipChain;

export const dotTestnet = {
  id: 'dot-testnet',
  name: 'Polkadot Testnet',
  addressPlaceholder: '1...',
  wagmiChain: undefined,
  chainflipId: 'Polkadot',
} satisfies ChainflipChain;

export const polygonMumbai = {
  id: 'evm-80001',
  name: 'Polygon Mumbai',
  addressPlaceholder: '0x...',
  wagmiChain: wagmiChains.polygonMumbai as WagmiChain,
} satisfies Chain;

export const arbitrumGoerli = {
  id: 'evm-421613',
  name: 'Arbitrum Goerli',
  addressPlaceholder: '0x...',
  wagmiChain: wagmiChains.arbitrumGoerli as WagmiChain,
} satisfies Chain;

export const optimismGoerli = {
  id: 'evm-420',
  name: 'Optimism Goerli',
  addressPlaceholder: '0x...',
  wagmiChain: wagmiChains.optimismGoerli as WagmiChain,
} satisfies Chain;

export const avalancheFuji = {
  id: 'evm-43113',
  name: 'Avalanche Fuji',
  addressPlaceholder: '0x...',
  wagmiChain: wagmiChains.avalancheFuji as WagmiChain,
} satisfies Chain;

export const moonbaseAlpha = {
  id: 'evm-1287',
  name: 'Moonbase Alpha',
  addressPlaceholder: '0x...',
  wagmiChain: wagmiChains.moonbaseAlpha as WagmiChain,
} satisfies Chain;

export const filecoinHyperspace = {
  id: 'evm-3141',
  name: 'Filecoin Hyperspace',
  addressPlaceholder: '0x...',
  wagmiChain: wagmiChains.filecoinHyperspace as WagmiChain,
} satisfies Chain;

export const bscTestnet = {
  id: 'evm-97',
  name: 'Binance Smart Chain Testnet',
  addressPlaceholder: '0x...',
  wagmiChain: wagmiChains.bscTestnet as WagmiChain,
} satisfies Chain;

export const fantomTestnet = {
  id: 'evm-4002',
  name: 'Fantom Testnet',
  addressPlaceholder: '0x...',
  wagmiChain: wagmiChains.fantomTestnet as WagmiChain,
} satisfies Chain;

export const celoAlfajores = {
  id: 'evm-44787',
  name: 'Celo Alfajores',
  addressPlaceholder: '0x...',
  wagmiChain: wagmiChains.celoAlfajores as WagmiChain,
} satisfies Chain;

export default [
  bitcoinTestnet,
  goerli,
  backspinEthereum,
  dotTestnet,
  polygonMumbai,
  arbitrumGoerli,
  optimismGoerli,
  avalancheFuji,
  moonbaseAlpha,
  filecoinHyperspace,
  bscTestnet,
  fantomTestnet,
  celoAlfajores,
];
