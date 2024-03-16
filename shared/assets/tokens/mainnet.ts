import { NATIVE_TOKEN_ADDRESS } from './constants';
import { bitcoin, ethereum, polkadot, polygon } from '../chains';
import { type Token, type ChainflipToken } from '.';

export const btc$: ChainflipToken = {
  chain: bitcoin,
  address: NATIVE_TOKEN_ADDRESS,
  name: 'Bitcoin',
  symbol: 'BTC',
  decimals: 8,
  chainflipId: 'Btc',
};

export const dot$: ChainflipToken = {
  chain: polkadot,
  address: NATIVE_TOKEN_ADDRESS,
  name: 'Polkadot',
  symbol: 'DOT',
  decimals: 10,
  chainflipId: 'Dot',
};

export const eth$: ChainflipToken = {
  chain: ethereum,
  address: NATIVE_TOKEN_ADDRESS,
  name: 'Ether',
  symbol: 'ETH',
  decimals: 18,
  chainflipId: 'Eth',
};

export const flip$: ChainflipToken = {
  chain: ethereum,
  address: '0x826180541412D574cf1336d22c0C0a287822678A',
  name: 'Chainflip',
  symbol: 'FLIP',
  decimals: 18,
  chainflipId: 'Flip',
};

export const usdc$: ChainflipToken = {
  chain: ethereum,
  address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  name: 'USDC',
  symbol: 'USDC',
  decimals: 6,
  chainflipId: 'Usdc',
};

export const matic$: Token = {
  chain: polygon,
  address: NATIVE_TOKEN_ADDRESS,
  name: 'Polygon',
  symbol: 'MATIC',
  decimals: 18,
};

export default [btc$, eth$, dot$, flip$, usdc$, matic$];
