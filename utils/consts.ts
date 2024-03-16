import { type ChainflipNetwork } from '@chainflip/sdk/swap';

export const ZERO_EVM_ADDRESS = '0x0000000000000000000000000000000000000000';

export const SWAPPING_APP_DOMAINS: Record<ChainflipNetwork, string> = {
  mainnet: 'swap.chainflip.io',
  perseverance: 'swap-perseverance.chainflip.xyz',
  sisyphos: 'swap.staging',
  backspin: 'swap-backspin.staging',
};

export const NETWORK_FEE = 'Network fee';
export const POOL_FEE = 'Pool fee';
export const INGRESS_FEE = 'Deposit fee';
export const EGRESS_FEE = 'Broadcast fee';
export const BROKER_FEE = 'Broker fee';

export const defaultAnimationProps = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3 },
};
