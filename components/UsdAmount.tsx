import { type Token } from '@/shared/assets/tokens';
import { SkeletonLine } from '@/shared/components';
import useTokenPrice from '@/shared/hooks/useTokenPrice';
import { type TokenAmount, formatWithNumeral } from '@/shared/utils';

export const UsdAmount = ({
  token,
  tokenAmount,
}: {
  token: Token | undefined;
  tokenAmount: TokenAmount | undefined;
}) => {
  const { price, isLoading } = useTokenPrice(token);

  if (!tokenAmount) return <>${Number(0).toFixed(2)}</>;
  if (!price && isLoading) return <SkeletonLine width={30} />;
  if (!price) return null;

  const formatted = formatWithNumeral(tokenAmount.mul(price).toFixedDisplay(), true);
  if (formatted.includes('NaN')) return null;

  return <span className="font-aeonikMono">${formatted}</span>;
};
