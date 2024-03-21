import { useQuery } from '@tanstack/react-query';
import { type Chain } from '@/shared/assets/chains';
import { isChainflipTokenOrChain } from '@/shared/assets/tokens';
import { CHAINFLIP_BLOCK_CONFIRMATIONS } from '@/shared/queryKeys';
import { integrationManager } from '../integrations';
import { type ChainflipIntegration } from '../integrations/chainflip';

type ConfirmationData = {
  isLoading: boolean;
  requiredBlockConfirmations?: number | null;
};

const useChainflipBlockConfirmations = (chain: Chain | undefined): ConfirmationData => {
  if (!isChainflipTokenOrChain(chain)) {
    return { requiredBlockConfirmations: null, isLoading: false };
  }

  const { data, isLoading } = useQuery({
    queryKey: [CHAINFLIP_BLOCK_CONFIRMATIONS],
    queryFn: () =>
      (
        integrationManager.getIntegration('chainflip') as ChainflipIntegration
      ).sdk.getRequiredBlockConfirmations(),
    select: (requiredConfirmations) => ({
      requiredBlockConfirmations: requiredConfirmations[chain.chainflipId],
    }),
  });

  return { ...data, isLoading };
};

export default useChainflipBlockConfirmations;
