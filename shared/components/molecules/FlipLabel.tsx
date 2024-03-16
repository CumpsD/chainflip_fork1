import classNames from 'classnames';
import { FLIP_SYMBOL, formatWithNumeral } from '@/shared/utils';
import type TokenAmount from '@/shared/utils/TokenAmount';
import LogoSquare from '../../icons/LogoSquare';
import { SkeletonLine } from '../atoms/LoadingSkeleton';

interface Props {
  amount: TokenAmount | undefined;
  prefix?: string;
  large?: boolean;
  icon?: boolean;
  symbol?: boolean;
  isLoading?: boolean;
  className?: string;
  usdAmount?: string;
  precise?: boolean;
}

export function FlipLabel({
  amount,
  prefix = '',
  icon = true,
  symbol = true,
  isLoading,
  large,
  className,
  usdAmount,
  precise = false,
}: Props): JSX.Element {
  const isLarge = large || usdAmount;
  const showSymbol = symbol && !usdAmount;

  return (
    <div className="flex flex-col">
      <div className={classNames(`flex items-center`, isLarge ? 'space-x-2' : 'space-x-1.5')}>
        {icon && (
          <div
            className={classNames(
              `flex flex-col items-center justify-center rounded-full bg-cf-gray-4`,
              isLarge ? 'h-[24px] w-[24px]' : 'h-[16px] w-[16px]',
            )}
          >
            <LogoSquare width={isLarge ? 11 : 7} height={isLarge ? 11 : 7} />
          </div>
        )}
        <div
          className={classNames(
            `flex items-end text-white`,
            isLarge ? 'text-20' : 'font-aeonikMono text-14',
            className,
          )}
        >
          {!isLoading ? (
            <span className={className}>
              {prefix}
              {precise
                ? amount?.toPreciseFormattedString() ?? '??'
                : amount?.toFormattedString() ?? '??'}
            </span>
          ) : (
            <div className="w-12">
              <SkeletonLine className="w-12" />
            </div>
          )}
        </div>
        {showSymbol && <div className="text-12 text-cf-light-2">{FLIP_SYMBOL}</div>}
      </div>
      {usdAmount && Number(usdAmount) !== 0 && (
        <div className="ml-auto text-12 text-cf-light-3">${formatWithNumeral(usdAmount)}</div>
      )}
    </div>
  );
}
