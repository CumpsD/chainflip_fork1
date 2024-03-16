import type { TokenAmount } from '@/shared/utils';

export function getAmountFromRate(amount: TokenAmount, rate: undefined): undefined;
export function getAmountFromRate(amount: TokenAmount, rate: number): TokenAmount;
export function getAmountFromRate(
  amount: TokenAmount,
  rate: number | undefined,
): TokenAmount | undefined {
  return rate !== undefined ? amount.mul(rate) : undefined;
}
