import React, { useEffect } from 'react';
import Link from 'next/link';
import { ChainTokenLogo } from '@/shared/components';
import useTracking from '@/shared/hooks/useTracking';
import ArrowRightIcon from '@/shared/icons/ArrowRight';
import { ArrowIcon } from '@/shared/icons/large';
import { type StatusResponse } from '../../integrations';
import { SwapEvents, type SwapTrackEvents } from '../../types/track';
import { SwapDetails } from '../SwapDetails';

export default function SwapCompletedCard({
  status,
  onViewDetails,
}: {
  status: StatusResponse;
  onViewDetails: VoidFunction;
}) {
  const track = useTracking<SwapTrackEvents>();
  useEffect(() => {
    track(SwapEvents.SwapComplete, {
      props: {
        assetFrom: `${status.srcToken.chain.name}.${status.srcToken.symbol}`,
        assetFromAmount: status.srcAmount.toFixed(),
        assetTo: `${status.destToken.chain.name}.${status.destToken.symbol}`,
        assetToAmount: status.destAmount.toFixed(),
        rate: status.destAmount.ratio(status.srcAmount).toFixed(),
        destinationAddress: status.destAddress,
        integration: status.integration,
      },
    });
  }, []);

  return (
    <div data-testid="swap-completed-card" className="flex flex-col items-center justify-center">
      <div className="box-shadow-success-1 bg-holy-radial-green-2 relative w-[300px] space-y-8 rounded-md border border-cf-green-3/20 p-5 sm:w-[402px]">
        <div className="mt-4 flex flex-col items-center justify-center space-y-4">
          <div className="flex items-center space-x-5 rounded-md border border-cf-green-3/20 bg-[#192723] px-6 py-5 backdrop-blur-[6px]">
            <ChainTokenLogo token={status.srcToken} />
            <div className="bg-holy-radial-green-1 rounded-md border border-cf-green-3/30 p-1 text-cf-green-1 backdrop-blur-[6px]">
              <ArrowRightIcon width="16px" height="16px" />
            </div>
            <ChainTokenLogo token={status.destToken} />
          </div>

          {status.integration === 'chainflip' ? (
            <>
              <div className="space-y-1 text-center">
                <div className="font-aeonikMedium text-20 text-white">Swap complete</div>
                <div className="font-aeonikRegular text-16 text-cf-light-3">
                  <span className="font-aeonikMono">
                    {status.destAmount.toPreciseFixedDisplay()}
                  </span>{' '}
                  {status.destToken.symbol} has been sent
                </div>
              </div>
              {status.integrationData && 'swapId' in status.integrationData && (
                <Link
                  href={`${process.env.NEXT_PUBLIC_EXPLORER_URL}/swaps/${status.integrationData.swapId}`}
                  className="flex items-center space-x-1.5 duration-150 hover:text-white hover:ease-out"
                  target="_blank"
                >
                  <span className="text-center font-aeonikMono text-12">View on explorer</span>
                  <ArrowIcon width={16} height={16} className="-rotate-45" />
                </Link>
              )}
            </>
          ) : (
            <div className="text-center font-aeonikMedium text-20 text-white">
              <span className="flex items-center">
                Your {status.srcToken.symbol} <ArrowRightIcon />
                {status.destToken.symbol} trade
              </span>
              <span className="text-white">has been completed</span>
            </div>
          )}
        </div>

        <div className="w-full space-y-3 text-12">
          <SwapDetails route={status.route} duration={status.duration} isSettledCard />
        </div>

        <div className="flex w-full space-x-6 font-aeonikMedium text-14">
          <Link
            type="button"
            className="w-3/5 rounded-md bg-cf-green-1 py-2 text-center text-black transition hover:bg-cf-green-3"
            href="/swap"
          >
            Swap again
          </Link>
          <button
            type="button"
            className="w-2/5 rounded-md border border-cf-green-3/50 py-2 text-cf-green-3 transition hover:border-white/30 hover:bg-cf-light-1/60"
            onClick={onViewDetails}
          >
            View details
          </button>
        </div>
      </div>
    </div>
  );
}
