import * as React from 'react';
import * as ethersV6 from 'ethers';
import * as ethersV5 from 'ethers-v5';
import { type WalletClient, useWalletClient } from 'wagmi';

export function walletClientToEthersV5Signer(walletClient: WalletClient) {
  const { account, chain, transport } = walletClient;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  const provider = new ethersV5.providers.Web3Provider(transport, network);
  return provider.getSigner(account.address);
}

export function walletClientToEthersV6Signer(walletClient: WalletClient) {
  const { account, chain, transport } = walletClient;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  const provider = new ethersV6.BrowserProvider(transport, network);
  return new ethersV6.JsonRpcSigner(provider, account.address);
}

// https://wagmi.sh/react/ethers-adapters
export function useEthersSigner({ chainId }: { chainId?: number } = {}) {
  const { data: walletClient } = useWalletClient({ chainId });
  return React.useMemo(
    () => (walletClient ? walletClientToEthersV6Signer(walletClient) : undefined),
    [walletClient],
  );
}
