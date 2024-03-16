import { createContext, useContext, useMemo, useCallback } from 'react';
import { FundingSDK } from '@chainflip/sdk/funding';
import { useQuery } from '@tanstack/react-query';
import { useEthersSigner } from '@/shared/hooks/useEthersSigner';
import { getChainflipNetwork, assert, TokenAmount } from '@/shared/utils';
import { useSubmitTransaction } from './useSubmitTransaction';
import { flip$ } from '../assets/tokens';

type FundingSDKContextProps = {
  fundingSDK: FundingSDK | undefined;
  flipBalance: string | undefined;
  approveFlip: (fundingAmount: bigint) => Promise<boolean>;
  fundStateChainAccount: (
    validatorIdHex: `0x${string}`,
    fundingAmount: bigint,
  ) => Promise<string | null>;
  minimumFunding: TokenAmount | undefined;
  redemptionDelayInMilliseconds: number | undefined;
};
interface FundingSDKProviderProps {
  children: React.ReactNode;
}
const FundingSDKContext = createContext<FundingSDKContextProps | undefined>(undefined);

export const FundingSDKProvider = ({ children }: FundingSDKProviderProps): JSX.Element => {
  const signer = useEthersSigner();
  const submitTransaction = useSubmitTransaction();

  const { data: fundingSDK } = useQuery({
    queryKey: ['fundingSDK', signer?.address],
    queryFn: async () => {
      if (!signer) return null;

      const network = getChainflipNetwork();
      assert(network !== 'unknown', 'funding sdk does not support unknown chainflip network');

      return new FundingSDK({ signer, network });
    },
  });

  const { data: flipBalance, refetch: updateFlipBalance } = useQuery({
    queryKey: ['flipBalance', signer?.address, Boolean(fundingSDK)],
    queryFn: () => {
      if (!fundingSDK) return null;
      return fundingSDK.getFlipBalance();
    },
    select: (balance) => {
      if (balance === null) return null;
      return balance.toString();
    },
    retry: true,
    retryDelay: 100,
    refetchInterval: 12000,
  });

  const { data: redemptionDelayInMilliseconds } = useQuery({
    queryKey: ['redemptionDelay', Boolean(fundingSDK)],
    queryFn: () => {
      if (!fundingSDK) return null;
      return fundingSDK.getRedemptionDelay();
    },
    select: (delay) => {
      if (delay === null) return null;
      return Number(delay * 1000n);
    },
    retry: true,
    retryDelay: 100,
    refetchInterval: 12000,
  });

  const { data: minimumFunding } = useQuery({
    queryKey: ['minimumFunding', Boolean(fundingSDK)],
    queryFn: async () => {
      if (!fundingSDK) return null;
      return fundingSDK.getMinimumFunding();
    },
    select: (amount) => {
      if (amount === null) return null;
      return new TokenAmount(amount, flip$.decimals);
    },
  });

  const approveFlip = useCallback(
    async (fundingAmount: bigint): Promise<boolean> => {
      const { success } = await submitTransaction('approve', async () => {
        if (!fundingSDK) return null;

        return fundingSDK.approveStateChainGateway(fundingAmount);
      });

      return success;
    },
    [fundingSDK, submitTransaction],
  );

  const fundStateChainAccount = useCallback(
    async (validatorIdHex: `0x${string}`, fundingAmount: bigint): Promise<string | null> => {
      if (!fundingSDK) return null;

      const { success, txHash } = await submitTransaction('funding', () =>
        fundingSDK.fundStateChainAccount(validatorIdHex, fundingAmount),
      );

      if (success) updateFlipBalance();

      return txHash;
    },
    [fundingSDK, updateFlipBalance, submitTransaction],
  );

  const context = useMemo(
    () => ({
      fundingSDK: fundingSDK ?? undefined,
      flipBalance: flipBalance ?? undefined,
      fundStateChainAccount,
      approveFlip,
      minimumFunding: minimumFunding ?? undefined,
      redemptionDelayInMilliseconds: redemptionDelayInMilliseconds ?? undefined,
    }),
    [
      fundingSDK,
      flipBalance,
      fundStateChainAccount,
      approveFlip,
      minimumFunding,
      redemptionDelayInMilliseconds,
    ],
  );

  return <FundingSDKContext.Provider value={context}>{children}</FundingSDKContext.Provider>;
};

const useFundingSDK = (): FundingSDKContextProps => {
  const context = useContext(FundingSDKContext);
  if (context === undefined) {
    throw new Error('useFundingSDK must be used within the FundingSDKProvider');
  }
  return context;
};

export default useFundingSDK;
