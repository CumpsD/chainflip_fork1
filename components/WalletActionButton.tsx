import React from 'react';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi';
import { type ChainId, parseEvmChainId } from '@/shared/assets/chains';
import { Button } from '@/shared/components';
import { type ButtonProps } from '@/shared/components/flip-ui-kit/Button';

const WalletActionButton = ({
  requireConnection,
  chainId,
  ...props
}: {
  requireConnection: boolean;
  chainId: ChainId | undefined;
} & ButtonProps): JSX.Element => {
  const { chain } = useNetwork();
  const { isConnected } = useAccount();
  const { switchNetwork } = useSwitchNetwork();
  const { openConnectModal } = useConnectModal();

  const srcTokenChainId = parseEvmChainId(chainId);

  let { children, onClick } = props;
  if (requireConnection && !isConnected) {
    children = 'Connect Wallet';
    onClick = openConnectModal ?? onClick;
  } else if (requireConnection && srcTokenChainId !== chain?.id) {
    children = 'Switch Network';
    onClick = () => switchNetwork?.(srcTokenChainId);
  }

  return (
    <Button {...props} onClick={onClick}>
      {children}
    </Button>
  );
};

export default WalletActionButton;
