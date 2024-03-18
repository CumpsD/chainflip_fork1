import React from 'react';
import BigNumber from 'bignumber.js';
import classNames from 'classnames';
// import GreenSpinnerJSON from '@/shared/animations/spinner-green.json';
import { Tooltip, ChainTokenLogo } from '@/shared/components';
import useTokenPrice from '@/shared/hooks/useTokenPrice';
import { EmojiSadIcon } from '@/shared/icons/large';
import { ClockIcon, LayersIcon } from '@/shared/icons/small';
import { formatToApproxTime } from '@/shared/utils';
// import Lottie from '@/shared/utils/Lottie';
import { integrationManager, type RouteResponse } from '../../../integrations';
import RadioButton from '../../RadioButton';
import { SwapDetails } from '../../SwapDetails';
import { UsdAmount } from '../../UsdAmount';
import MarketData from '../MarketData';

const Badge = ({
  text,
  color,
  className,
  isBold = true,
}: {
  text: string;
  color: 'green' | 'purple';
  className: HTMLDivElement['className'];
  isBold?: boolean;
}) => (
  <div
    className={classNames('rounded-full border text-center text-10', className, {
      'border-cf-green-1/10 bg-cf-green-4 text-cf-green-1': color === 'green',
      'border-cf-blue-4/20 bg-cf-blue-4/10 text-cf-blue-4': color === 'purple',
      'font-aeonikBold': isBold,
    })}
  >
    {text}
  </div>
);

export const RouteCardLoading = () => (
  <div className="bg-holy-radial-gray-3-60 flex h-[334px] items-center justify-center space-y-3 rounded-md border border-cf-gray-4 p-5 text-14 text-cf-light-1 backdrop-blur-[6px] duration-150">
    <div className="flex items-center">
      {/* <Lottie as="div" className="mr-2 h-5 w-5" animationData={GreenSpinnerJSON} autoplay loop /> */}
      <span>Fetching routes...</span>
    </div>
  </div>
);
export const RouteCardNotFound = () => (
  <div className="bg-holy-radial-gray-3-60 flex h-[334px] cursor-pointer items-center justify-center space-y-3 rounded-md border border-cf-gray-4 p-5 duration-150">
    <div className="flex flex-col items-center justify-center space-y-1">
      <EmojiSadIcon className="text-cf-light-2" width={60} height={60} />
      <span className="px-20 text-center text-14 text-cf-light-1">
        No routes available at this time. Please try a different pair.
      </span>
    </div>
  </div>
);

type RouteCardProps = {
  route: RouteResponse;
  onRouteSelected: (route: RouteResponse) => void;
  isSingleCard?: boolean;
  isSelected?: boolean;
  differenceFromWorstRoute?: string | undefined;
  disabled?: boolean;
  spinner?: JSX.Element;
  isRecommended?: boolean;
};

export const RouteCard = ({
  route,
  onRouteSelected,
  isSelected = false,
  isSingleCard = false,
  differenceFromWorstRoute,
  disabled = false,
  spinner,
  isRecommended = false,
}: RouteCardProps) => {
  const integrationName = integrationManager.getName(route.integration);
  const Logo = integrationManager.getLogo(route.integration);
  const { price: destTokenPrice } = useTokenPrice(route.destToken);

  const swapDuration =
    route.durationSeconds > 0 ? formatToApproxTime(route.durationSeconds) : undefined;

  const differenceFromWorstRouteUsd =
    differenceFromWorstRoute && destTokenPrice
      ? new BigNumber(differenceFromWorstRoute).multipliedBy(destTokenPrice)
      : undefined;

  const numberOfHops = new Set([route.steps.map((step) => step.protocolName)]).size;

  return (
    <div
      tabIndex={!isSingleCard ? 0 : undefined}
      role={!isSingleCard ? 'button' : 'main'}
      aria-disabled={isSingleCard}
      className={classNames('w-full space-y-3 rounded-md border p-5 duration-150', {
        'bg-holy-radial-gray-3-60 border-cf-gray-4': disabled || (isSelected && isSingleCard),
        'bg-route-card-selected hover:bg-route-card-selected-hovered border-white border-opacity-20':
          isSelected && !isSingleCard,
        'bg-holy-radial-gray-3-60 hover:bg-holy-radial-gray-4-60 border-cf-gray-4 backdrop-blur-[6px]':
          !isSelected && !isSingleCard,
      })}
      onClick={() => {
        if (!isSingleCard) {
          onRouteSelected(route);
        }
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-between space-x-3">
          {!isSingleCard && <RadioButton selected={isSelected} />}
          {isRecommended && <Badge text="Recommended" color="green" className="px-[10px] py-1" />}
          {route.integration === 'chainflip' && (
            <Badge text="Native" color="purple" className="px-[10px] py-1" />
          )}
        </div>
        <div className="flex items-center justify-between rounded-md border border-cf-gray-4 bg-cf-gray-3 font-aeonikMono text-12 ">
          {swapDuration && (
            <Tooltip
              tooltipClassName="w-[306px]"
              content="Estimated time to receive, process, and send your funds to the destination address"
            >
              <div className="flex items-center py-1 pl-2 pr-1">
                <ClockIcon className="text-cf-green-1" />
                <span className="font-bold text-cf-light-3">{swapDuration}</span>
              </div>
            </Tooltip>
          )}

          <Tooltip
            tooltipClassName="w-[306px]"
            content="Number of exchanges or bridges involved in the route"
          >
            <div className="flex items-center py-1 pl-1 pr-2">
              <LayersIcon className="text-cf-green-1" />
              <span className="font-bold text-cf-light-3">{numberOfHops}</span>
            </div>
          </Tooltip>
        </div>
      </div>

      <div className="flex items-center justify-start space-x-3">
        <ChainTokenLogo token={route.destToken} />
        <div>
          <div className="flex items-center justify-start space-x-3">
            <span className="font-aeonikBold text-20 text-white">
              {route.destAmount.toPreciseFixedDisplay()} {route.destToken.symbol}
            </span>
            {differenceFromWorstRouteUsd?.gt(0) && (
              <Badge
                text={`+$${differenceFromWorstRouteUsd.toFixed(2)} saved`}
                color="green"
                className="px-1"
                isBold={false}
              />
            )}
          </div>
          <div className="mt-[-3px] flex items-center justify-start space-x-1 text-12 text-cf-light-2">
            {destTokenPrice && (
              <>
                <span className="font-aeonikMono">
                  <UsdAmount token={route.destToken} tokenAmount={route.destAmount} />
                </span>
                <span className="pb-1.5 text-12">.</span>
              </>
            )}

            <div className="flex items-center justify-start space-x-1">
              <Logo width={13} height={13} />
              <span className="font-aeonikMedium">{integrationName}</span>
            </div>
          </div>
        </div>
      </div>
      <SwapDetails route={route} disabled={disabled} />
      <MarketData disabled={disabled} spinner={spinner} route={route} />
    </div>
  );
};

export default RouteCard;
