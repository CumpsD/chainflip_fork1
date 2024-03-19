import React from 'react';
// import WhiteSpinner from '@/shared/animations/spinner-white.json';
import { ChainTokenLogo, CopyButton } from '@/shared/components';
import { Rotate2Icon } from '@/shared/icons/small';
// import Lottie from '@/shared/utils/Lottie';
import { useCountdown } from '../../hooks/useCountdown';
import { type StatusResponse } from '../../integrations';
import { SwapDetails } from '../SwapDetails';
import { UsdAmount } from '../UsdAmount';

const SwapRouteCard = ({
  status,
  refreshQuote,
}: {
  status: StatusResponse;
  refreshQuote: () => void;
}) => {
  const formattedTime = useCountdown(60, false, refreshQuote);
  const priceCanChange =
    status.status === 'waiting_for_src_tx' || status.status === 'waiting_for_src_tx_confirmation';

  const isRouteRefreshing = false;

  return (
    <div className="bg-holy-radial-gray-3-60 w-[383px] space-y-4 rounded-md border border-cf-gray-4 p-5 duration-150">
      <div className="flex items-center justify-between">
        <span className="cf-gray-gradient font-aeonikMedium text-20">Swap Details</span>
        {priceCanChange && (
          <div className="flex items-center space-x-2">
            <div className="flex h-[24px] w-[24px] items-center justify-center rounded-[100%] border border-cf-gray-5  bg-cf-gray-4 transition ease-in hover:rotate-[30deg]">
              {isRouteRefreshing ? (
                // <Lottie
                //   className="p-1"
                //   as="span"
                //   speed={isRouteRefreshing ? 2 : 0.5}
                //   animationData={WhiteSpinner}
                //   autoplay
                //   loop
                // />
                <></>
              ) : (
                <Rotate2Icon className="text-cf-green-3" />
              )}
            </div>
            <span className="font-aeonikMono text-12 font-bold text-cf-light-2">
              {formattedTime}
            </span>
          </div>
        )}
      </div>

      <div className="flex w-full flex-col items-start justify-start space-y-2">
        <div className="w-full text-cf-light-2">
          <span className="font-aeonikBold text-12">Deposit</span>
          <div className="flex items-center justify-start space-x-4">
            <ChainTokenLogo token={status.route.srcToken} />
            <div className="flex w-full flex-col">
              <div className="flex items-center justify-between">
                <span className="font-aeonikBold text-white">
                  {status.route.srcAmount.toPreciseFixedDisplay()} {status.route.srcToken.symbol}
                </span>
                <CopyButton textToCopy={status.route.srcAmount.toFixed()} />
              </div>
              <span className="font-aeonikMono text-12">
                <UsdAmount token={status.route.srcToken} tokenAmount={status.route.srcAmount} />
              </span>
            </div>
          </div>
        </div>
        <div className="text-cf-light-2">
          <span className="font-aeonikBold text-12">Receive</span>
          <div className="flex items-center justify-start space-x-4">
            <ChainTokenLogo token={status.route.destToken} />
            <div className="flex flex-col">
              <span className="font-aeonikBold text-white">
                {status.route.destAmount.toPreciseFixedDisplay()} {status.route.destToken.symbol}
              </span>
              <span className="font-aeonikMono text-12">
                <UsdAmount token={status.route.destToken} tokenAmount={status.route.destAmount} />
              </span>
            </div>
          </div>
        </div>
      </div>

      <SwapDetails route={status.route} showDestinationAddress />
    </div>
  );
};

export default SwapRouteCard;
