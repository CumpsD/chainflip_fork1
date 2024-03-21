import React from 'react';
import Link from 'next/link';
import { EmojiSadIcon, RefreshIcon } from '@/shared/icons/large';
import { type StatusResponse } from '../../integrations';
import { SwapDetails } from '../SwapDetails';

const getId = (status: StatusResponse) => {
  if (
    status.integration === 'chainflip' &&
    status.integrationData &&
    'swapId' in status.integrationData
  ) {
    return status.integrationData.swapId;
  }

  return status.id;
};

export default function SwapFailedCard({ status }: { status: StatusResponse }) {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="bg-holy-radial-pink-1 relative w-[300px] space-y-8 rounded-md border border-cf-red-3/20 p-5 sm:w-[402px]">
        <div className="mt-4 flex flex-col items-center justify-center space-y-3">
          <div>
            <EmojiSadIcon width={100} height={100} className="-my-2 text-cf-light-2" />
          </div>

          <div className="space-y-1 text-center">
            <div className="font-aeonikRegular text-20 text-white">
              {status.integration === 'chainflip' &&
              status.integrationData?.state === 'BROADCAST_ABORTED'
                ? 'Broadcast aborted'
                : 'Swap failed'}
            </div>
            <div className="font-aeonikRegular text-14 text-cf-light-2">
              Contact us with ticket number #{getId(status)} to resolve the issue.
            </div>
          </div>

          <Link
            href="/"
            className="flex items-center space-x-1.5 text-cf-light-3 duration-150 hover:text-white hover:ease-out"
          >
            <RefreshIcon width={16} height={16} />
            <span className="text-center font-aeonikMedium text-12">Try another swap</span>
          </Link>
        </div>

        <div className="w-full space-y-3 text-12">
          <SwapDetails route={status.route} duration={status.duration} isSettledCard />
        </div>
      </div>
    </div>
  );
}
