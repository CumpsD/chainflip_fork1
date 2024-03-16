import BigNumber from 'bignumber.js';
import { type BaseChainflipAsset } from '@/shared/utils/chainflip';
import { chainflipAssetMap } from '@/shared/utils/env';
import TokenAmount from './TokenAmount';

export const MIN_TICK = -887272;
export const MAX_TICK = -MIN_TICK;

export const tickToRate = (tick: number, baseAsset: BaseChainflipAsset): number => {
  // https://blog.uniswap.org/uniswap-v3-math-primer
  const rawRate = BigNumber(1.0001 ** tick);
  const rateDecimals = chainflipAssetMap.Usdc.decimals - chainflipAssetMap[baseAsset].decimals;

  return rawRate.shiftedBy(-rateDecimals).toNumber();
};

export const rateToTick = (rate: BigNumber.Value, baseAsset: BaseChainflipAsset): number => {
  const rateDecimals = chainflipAssetMap.Usdc.decimals - chainflipAssetMap[baseAsset].decimals;
  const rawRate = BigNumber(rate).shiftedBy(rateDecimals);

  let tick = Math.log(rawRate.toNumber()) / Math.log(1.0001);
  tick = Math.round(tick * 1e6) / 1e6; // prevent flooring results like -207244.0000000557 to -207245
  tick = Math.floor(tick);

  return Math.max(MIN_TICK, Math.min(tick, MAX_TICK));
};

export const calculateRequiredLiquidityRatio = (
  _currentRate: BigNumber.Value,
  lowerTick: number,
  upperTick: number,
  baseAsset: BaseChainflipAsset,
): number => {
  // when adding liquidity to a pool, the ratio of added assets must match the asset distribution in the given range
  const currentRate = BigNumber(_currentRate).toNumber();
  const currentTick = rateToTick(currentRate, baseAsset);

  if (currentTick < lowerTick) return 0; // range above current price has only base assets
  if (currentTick >= upperTick) return Number.POSITIVE_INFINITY; // range below current price has only quote assets

  // we want to calculate the ratio Δy/Δx. rearranging the formulas of the blog post leads to:
  // Δy/Δx = sqrt(Pc * Pc * Pb) - sqrt(Pc * Pb * Pa) / (sqrt(Pb) - sqrt(Pc))
  // https://uniswapv3book.com/docs/milestone_1/calculating-liquidity/
  const lowerRate = tickToRate(lowerTick, baseAsset);
  const upperRate = tickToRate(upperTick, baseAsset);
  const numerator =
    Math.sqrt(currentRate * currentRate * upperRate) -
    Math.sqrt(currentRate * upperRate * lowerRate);
  const denominator = Math.sqrt(upperRate) - Math.sqrt(currentRate);

  return numerator / denominator;
};

export const liquidityToTokenAmounts = ({
  liquidity,
  currentRate,
  lowerTick,
  upperTick,
  baseAsset,
}: {
  liquidity: BigNumber.Value;
  currentRate: BigNumber.Value;
  lowerTick: number;
  upperTick: number;
  baseAsset: BaseChainflipAsset;
}) => {
  const rateDecimals = chainflipAssetMap.Usdc.decimals - chainflipAssetMap[baseAsset].decimals;

  const rawRate = BigNumber(currentRate).shiftedBy(rateDecimals).toNumber();
  // eslint-disable-next-line no-underscore-dangle
  const _liquidity = BigNumber(liquidity);

  const quoteToken = chainflipAssetMap.Usdc;
  const baseToken = chainflipAssetMap[baseAsset];
  const currentRawSqrtRate = Math.sqrt(rawRate);
  const currentPriceTick = rateToTick(currentRate, baseAsset);
  const rawSqrtRateLower = Math.sqrt(1.0001 ** lowerTick);
  const rawSqrtRateUpper = Math.sqrt(1.0001 ** upperTick);

  let quoteAssetAmount = BigNumber(0);
  let baseAssetAmount = BigNumber(0);

  // https://blog.uniswap.org/uniswap-v3-math-primer-2#how-to-calculate-current-holdings
  if (currentPriceTick < lowerTick) {
    const numerator = rawSqrtRateUpper - rawSqrtRateLower;
    const denominator = rawSqrtRateLower * rawSqrtRateUpper;

    baseAssetAmount = _liquidity.multipliedBy(numerator / denominator);
  } else if (currentPriceTick >= upperTick) {
    quoteAssetAmount = _liquidity.multipliedBy(rawSqrtRateUpper - rawSqrtRateLower);
  } else if (currentPriceTick >= lowerTick && currentPriceTick < upperTick) {
    const numerator = rawSqrtRateUpper - currentRawSqrtRate;
    const denominator = currentRawSqrtRate * rawSqrtRateUpper;

    baseAssetAmount = _liquidity.multipliedBy(numerator / denominator);
    quoteAssetAmount = _liquidity.multipliedBy(currentRawSqrtRate - rawSqrtRateLower);
  }

  const quoteAssetTokenAmount = new TokenAmount(quoteAssetAmount, quoteToken.decimals);
  const baseAssetTokenAmount = new TokenAmount(baseAssetAmount, baseToken.decimals);

  return {
    quoteAsset: quoteAssetTokenAmount,
    baseAsset: baseAssetTokenAmount,
  };
};
