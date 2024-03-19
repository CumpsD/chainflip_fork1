import React, { useEffect } from 'react';
import Link from 'next/link';
import { ChainTokenLogo } from '@/shared/components';
import useTracking from '@/shared/hooks/useTracking';
import ArrowRightIcon from '@/shared/icons/ArrowRight';
import { ArrowIcon } from '@/shared/icons/large';
import { type StatusResponse } from '../../integrations';
import { SwapEvents, type SwapTrackEvents } from '../../types/track';
import { SwapDetails } from '../SwapDetails';

export default function SwapBroadcastCard({ status }: { status: StatusResponse }) {
  const track = useTracking<SwapTrackEvents>();
  useEffect(() => {
    track(SwapEvents.SendingFunds, {
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
    <div
      data-testid="broadcast-requested-card"
      className="flex flex-col items-center justify-center"
    >
      <div className="bg-holy-radial-pink-1 relative w-[300px] space-y-8 rounded-md border border-cf-red-3/20 p-5 sm:w-[402px]">
        <div className="mt-4 flex flex-col items-center justify-center space-y-4">
          <div className="flex items-center space-x-5 rounded-md border border-cf-red-3/20 bg-[#271920] px-6 py-5 backdrop-blur-[6px]">
            <ChainTokenLogo token={status.srcToken} />
            <div className="bg-holy-radial-pink-1 rounded-md border border-cf-red-3/20 p-1 text-cf-red-2 backdrop-blur-[6px]">
              <ArrowRightIcon width="16px" height="16px" />
            </div>
            <ChainTokenLogo token={status.destToken} />
          </div>

          <div className="space-y-1 text-center">
            <div className="font-aeonikMedium text-20 text-white">Sending funds</div>
            <div className="font-aeonikRegular text-16 text-cf-light-3">
              <span className="font-aeonikMono">{status.destAmount.toPreciseFixedDisplay()}</span>{' '}
              {status.destToken.symbol}
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
        </div>
        <div className="w-full space-y-3 text-12">
          <SwapDetails route={status.route} isSettledCard />
        </div>
      </div>
    </div>
  );
}
