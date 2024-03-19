import {
  backspinEthereum,
  bitcoin,
  bitcoinTestnet,
  type Chain,
  type ChainId,
  dotTestnet,
  ethereum,
  goerli,
  polkadot,
} from '@/shared/assets/chains'
import {
  type ChainflipAsset,
  type ChainflipChain,
} from '@/shared/utils/chainflip'
import { assert } from './helpers'
import {
  beth$,
  bflip$,
  btc$,
  busdc$,
  type ChainflipToken,
  dot$,
  eth$,
  flip$,
  geth$,
  gusdc$,
  pdot$,
  tbtc$,
  tflip$,
  usdc$,
} from '../assets/tokens'

const chainflipNetworks = [
  'unknown',
  'backspin',
  'sisyphos',
  'perseverance',
  'mainnet',
] as const

export type ChainflipNetwork = (typeof chainflipNetworks)[number]

function assertChainflipNetwork(
  network: string
): asserts network is ChainflipNetwork {
  assert(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    chainflipNetworks.includes(network as any),
    `Invalid network: "${network}"`
  )
}

export const getChainflipNetwork = (): ChainflipNetwork => {
  // using unknown because this function is bundled in the shared package
  const network = process.env.NEXT_PUBLIC_CHAINFLIP_NETWORK ?? 'unknown'
  assertChainflipNetwork(network)
  return network
}

const getEthereumChain = () => {
  const network = getChainflipNetwork()
  if (network === 'backspin') return backspinEthereum
  if (network === 'mainnet') return ethereum
  return goerli
}

const getChainflipToken = (asset: ChainflipAsset): ChainflipToken => {
  const network = getChainflipNetwork()

  if (network === 'mainnet') {
    return {
      Flip: flip$,
      Usdc: usdc$,
      Eth: eth$,
      Dot: dot$,
      Btc: btc$,
    }[asset]
  }

  if (network === 'backspin') {
    return {
      Flip: bflip$,
      Usdc: busdc$,
      Eth: beth$,
      Dot: pdot$,
      Btc: tbtc$,
    }[asset]
  }

  return {
    Flip: tflip$,
    Usdc: gusdc$,
    Eth: geth$,
    Dot: pdot$,
    Btc: tbtc$,
  }[asset]
}

export const chainflipChainMap = {
  Bitcoin: getChainflipNetwork() === 'mainnet' ? bitcoin : bitcoinTestnet,
  Ethereum: getEthereumChain(),
  Polkadot: getChainflipNetwork() === 'mainnet' ? polkadot : dotTestnet,
} as const satisfies Record<ChainflipChain, Chain>

export const chainflipAssetMap = {
  Eth: getChainflipToken('Eth'),
  Usdc: getChainflipToken('Usdc'),
  Flip: getChainflipToken('Flip'),
  Dot: getChainflipToken('Dot'),
  Btc: getChainflipToken('Btc'),
} as const satisfies Record<ChainflipAsset, ChainflipToken>

export const mapTokenToChainflipAsset = (
  chainId: ChainId,
  tokenAddress: string
): ChainflipAsset | undefined =>
  Object.entries(chainflipAssetMap).find(
    ([, token]) => token.chain.id === chainId && token.address === tokenAddress
  )?.[0] as ChainflipAsset | undefined

export const FLIP_SYMBOL = chainflipAssetMap.Flip.symbol
