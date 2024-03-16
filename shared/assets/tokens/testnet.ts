import { NATIVE_TOKEN_ADDRESS } from './constants';
import { bitcoinTestnet, goerli, polygonMumbai, dotTestnet, backspinEthereum } from '../chains';
import { type Token, type ChainflipToken } from '.';

export const tbtc$: ChainflipToken = {
  chain: bitcoinTestnet,
  address: NATIVE_TOKEN_ADDRESS,
  name: 'Test Bitcoin',
  symbol: 'tBTC',
  decimals: 8,
  chainflipId: 'Btc',
};

export const pdot$: ChainflipToken = {
  chain: dotTestnet,
  address: NATIVE_TOKEN_ADDRESS,
  name: 'Test Polkadot',
  symbol: 'pDOT',
  decimals: 10,
  chainflipId: 'Dot',
};

export const geth$: ChainflipToken = {
  chain: goerli,
  address: NATIVE_TOKEN_ADDRESS,
  name: 'Goerli Ether',
  symbol: 'gETH',
  decimals: 18,
  chainflipId: 'Eth',
};

export const tflip$: ChainflipToken = {
  chain: goerli,
  address: process.env.NEXT_PUBLIC_FLIP_CONTRACT_ADDRESS as string,
  name: 'Testnet FLIP',
  symbol: 'tFLIP',
  canonicalSymbol: 'FLIP',
  decimals: 18,
  chainflipId: 'Flip',
};

export const gusdc$: ChainflipToken = {
  chain: goerli,
  address: '0x07865c6E87B9F70255377e024ace6630C1Eaa37F',
  name: 'Goerli USDC',
  symbol: 'gUSDC',
  canonicalSymbol: 'USDC',
  decimals: 6,
  chainflipId: 'Usdc',
};

export const beth$: ChainflipToken = {
  chain: backspinEthereum,
  address: NATIVE_TOKEN_ADDRESS,
  name: 'Backspin Ether',
  symbol: 'bETH',
  decimals: 18,
  chainflipId: 'Eth',
};

export const bflip$: ChainflipToken = {
  chain: backspinEthereum,
  address: '0x10C6E9530F1C1AF873a391030a1D9E8ed0630D26',
  name: 'Backspin Flip',
  symbol: 'bFLIP',
  decimals: 18,
  chainflipId: 'Flip',
};

export const busdc$: ChainflipToken = {
  chain: backspinEthereum,
  address: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
  name: 'Backspin Usdc',
  symbol: 'bUSDC',
  decimals: 6,
  chainflipId: 'Usdc',
};

export const mumbaiMatic$: Token = {
  chain: polygonMumbai,
  address: NATIVE_TOKEN_ADDRESS,
  name: 'Mumbai Polygon',
  symbol: 'MATIC',
  decimals: 18,
};

export default [tbtc$, geth$, beth$, bflip$, busdc$, pdot$, tflip$, gusdc$, mumbaiMatic$];
