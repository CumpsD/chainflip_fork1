import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { erc20ABI, useAccount, useContractReads, usePublicClient } from 'wagmi';
import { type Chain, parseEvmChainId, type ChainId } from '@/shared/assets/chains';
import { NATIVE_TOKEN_ADDRESS } from '@/shared/assets/tokens/constants';
import { TokenAmount } from '@/shared/utils';
import { useTokens } from './useTokens';

// https://github.com/mds1/multicall
const multicallAbi = [
  {
    inputs: [{ internalType: 'address', name: 'addr', type: 'address' }],
    name: 'getEthBalance',
    outputs: [
      {
        internalType: 'uint256',
        name: 'balance',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

interface BalancesData {
  balances: Partial<Record<string, TokenAmount>>;
  isLoading: boolean;
}

type Balances = Partial<Record<ChainId, Partial<Record<string, TokenAmount>>>>;

type ContextValue = [Balances, React.Dispatch<React.SetStateAction<Balances>>];

const Context = createContext<ContextValue | null>(null);

export const ChainBalancesProvider = ({ children }: { children: React.ReactNode }) => {
  const [balances, setBalances] = useState<Balances>({});
  const { address } = useAccount();

  useEffect(() => {
    setBalances({});
  }, [address]);

  const ctx = useMemo(() => [balances, setBalances] as ContextValue, [balances]);

  return <Context.Provider value={ctx}>{children}</Context.Provider>;
};

export const useChainBalances = (chain: Chain | undefined): BalancesData => {
  const ctx = useContext(Context);

  if (ctx === null) {
    throw new Error('useChainBalances must be used within a ChainBalancesProvider');
  }
  const [balances, setBalances] = ctx;

  const { address: connectedAddress } = useAccount();
  const { value: tokens, isLoading: tokensLoading } = useTokens(chain?.id);
  const evmChainId = parseEvmChainId(chain?.id);
  const publicClient = usePublicClient({ chainId: evmChainId });

  const calls = useMemo(() => {
    if (!connectedAddress || !publicClient.chains?.[0] || evmChainId === undefined) {
      return undefined;
    }

    const { id: chainId } = publicClient.chain;
    if (evmChainId !== chainId) return undefined;

    const wagmiChain = publicClient.chains?.find((c) => c.id === chainId);
    if (!wagmiChain) return undefined;

    return tokens.map((token) =>
      token.address === NATIVE_TOKEN_ADDRESS
        ? ({
            chainId: evmChainId,
            abi: multicallAbi,
            address: wagmiChain.contracts?.multicall3?.address,
            functionName: 'getEthBalance',
            args: [connectedAddress],
          } as const)
        : ({
            chainId: evmChainId,
            abi: erc20ABI,
            address: token.address as `0x${string}`,
            functionName: 'balanceOf',
            args: [connectedAddress],
          } as const),
    );
  }, [tokens, publicClient, connectedAddress, evmChainId]);

  const { isLoading: balancesLoading } = useContractReads({
    contracts: calls,
    allowFailure: true,
    staleTime: 5000, // cache chain balances for 5 seconds
    onSuccess(balancesData) {
      if (balancesData?.length !== tokens.length || !chain?.id) return;
      const balanceEntries =
        balancesData?.map((result, index) => [
          tokens[index].address,
          new TokenAmount(String(result.result ?? 0), tokens[index].decimals),
        ]) ?? [];

      if (!balanceEntries.length) return;

      setBalances((current) => ({
        ...current,
        [chain.id]: Object.fromEntries(balanceEntries),
      }));
    },
  });

  return useMemo(
    () => ({
      balances: (chain?.id && balances[chain.id]) ?? {},
      isLoading: tokensLoading || balancesLoading,
    }),
    [balances, balancesLoading, tokensLoading, chain?.id],
  );
};
