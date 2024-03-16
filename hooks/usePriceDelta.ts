import BigNumber from 'bignumber.js';
import type { Token } from '@/shared/assets/tokens';
import useTokenPrice from '@/shared/hooks/useTokenPrice';
import { type TokenAmount } from '@/shared/utils';

type PriceDeltaOptions = {
  srcAmount: TokenAmount | undefined;
  destAmount: TokenAmount | undefined;
  srcAsset: Token | undefined;
  destAsset: Token | undefined;
};

const lowLiquidityThreshold = -10; // -10%

const getColor = (delta: BigNumber) => {
  if (delta.lte(lowLiquidityThreshold)) return 'text-cf-red-2';
  if (delta.lt(-1)) return 'text-cf-white';
  return 'text-cf-green-3';
};

export default function usePriceDelta({
  srcAmount,
  destAmount,
  srcAsset,
  destAsset,
}: PriceDeltaOptions):
  | { delta: null; isLowLiquidity: false; color: string }
  | { delta: BigNumber; isLowLiquidity: boolean; color: string } {
  const { price: depositPrice } = useTokenPrice(srcAsset);
  const { price: destinationPrice } = useTokenPrice(destAsset);

  if (!depositPrice || !destinationPrice || !srcAmount || !destAmount) {
    return {
      delta: null,
      isLowLiquidity: false,
      color: 'text-cf-white',
    };
  }

  const expectedOutput = new BigNumber(depositPrice)
    .times(srcAmount.toFixed())
    .dividedBy(destinationPrice);

  const delta = new BigNumber(destAmount.toFixed())
    .minus(expectedOutput)
    .dividedBy(expectedOutput)
    .multipliedBy(100);

  return {
    delta,
    isLowLiquidity: delta.lte(lowLiquidityThreshold),
    color: getColor(delta),
  };
}
