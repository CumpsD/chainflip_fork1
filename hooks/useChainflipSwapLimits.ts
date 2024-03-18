import { useQuery } from '@tanstack/react-query'
import { isChainflipTokenOrChain, type Token } from '@/shared/assets/tokens'
import { CHAINFLIP_SWAP_LIMITS } from '@/shared/queryKeys'
import { TokenAmount } from '@/shared/utils'
import { integrationManager } from '../integrations'
import { type ChainflipIntegration } from '../integrations/chainflip'

type LimitData = {
  isLoading: boolean
  maximumSwapAmount?: TokenAmount | null
  minimumSwapAmount?: TokenAmount | null
}

const useChainflipSwapLimits = (token: Token | undefined): LimitData => {
  if (!isChainflipTokenOrChain(token)) {
    return {
      maximumSwapAmount: null,
      minimumSwapAmount: null,
      isLoading: false,
    }
  }

  // const { data, isLoading } = useQuery({
  //   queryKey: [CHAINFLIP_SWAP_LIMITS, token.chain.id, token.address],
  //   queryFn: () =>
  //     (integrationManager.getIntegration('chainflip') as ChainflipIntegration).getSwapLimits(
  //       token?.chain.id,
  //       token?.address,
  //     ),
  //   select: ({ maximumAmount, minimumAmount }) => ({
  //     maximumSwapAmount: maximumAmount ? new TokenAmount(maximumAmount, token.decimals) : null,
  //     minimumSwapAmount: minimumAmount ? new TokenAmount(minimumAmount, token.decimals) : null,
  //   }),
  // });

  // return { ...data, isLoading };
  return {
    maximumSwapAmount: null,
    minimumSwapAmount: null,
    isLoading: false,
  }
}

export default useChainflipSwapLimits
