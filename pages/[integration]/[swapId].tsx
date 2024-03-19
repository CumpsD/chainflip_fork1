import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { AnimatePresence, motion } from 'framer-motion';
import LoadingSpinner from '@/shared/components/LoadingSpinner';
import { ArrowBackIcon } from '@/shared/icons/small';
import isChannelExpired from '@/utils/isChannelExpired'
import SwapBroadcastCard from '@/components/StatusPage/SwapBroadcastCard'
import SwapCompletedCard from '@/components/StatusPage/SwapCompletedCard' 
import SwapEventLog from '@/components/StatusPage/SwapEventLog'
import SwapFailedCard from '@/components/StatusPage/SwapFailedCard'
import SwapRouteCard from '@/components/StatusPage/SwapRouteCard'
import SwapStatusCard from '@/components/StatusPage/SwapStatusCard'
import useStore from '@/hooks/useStore'
import useSwapStatus from '@/hooks/useSwapStatus'
import { type SwapStatus } from '@/integrations'
import { defaultAnimationProps } from '@/utils/consts'

const animateDetails = {
  enter: {
    opacity: 1,
    x: '0%',
  },
  exit: {
    opacity: 0,
    x: '-5%',
  },
};

const inProgressStates: SwapStatus[] = [
  'waiting_for_src_tx',
  'waiting_for_src_tx_confirmation',
  'waiting_for_dest_tx',
];

const animationProps = {
  ...defaultAnimationProps,
  transition: { duration: 0.6 },
};

const alertUser = (event: BeforeUnloadEvent) => {
  event.preventDefault();
  event.returnValue = ''; // eslint-disable-line no-param-reassign
};

export default function Status() {
  const router = useRouter();
  const { swapId } = router.query;
  const [viewDetails, setViewDetails] = useState(false);
  const resetSwapRequest = useStore((state) => state.reset);
  const { status, isLoading, isWaitingRoomStatus, refreshStatus } = useSwapStatus();

  useEffect(() => {
    if (status?.status !== 'completed' && status?.status !== 'failed') {
      window.addEventListener('beforeunload', alertUser);
    }

    return () => {
      window.removeEventListener('beforeunload', alertUser);
    };
  }, [status?.status]);

  useEffect(() => {
    // prefer shareable id in url to allow for sharing url
    if (status?.shareableId && status.shareableId !== status.id && status.id === swapId) {
      router.replace(`/${status.integration}/${status.shareableId}`);
    }

    // Forbid access to swaps that were not created via the frontend
    if (
      status?.integration === 'chainflip' &&
      status.integrationData &&
      status.depositAddress &&
      status.integrationData.depositChannelOpenedThroughBackend === false
    ) {
      router.push('/');
    }

    // reset the form after we get to this point because we no longer rely on
    // the form data. now when the user clicks "swap again" the form is empty
    if (status?.status === 'waiting_for_src_tx_confirmation') {
      resetSwapRequest();
    }
  }, [status]);

  const showBackButton = status?.status === 'waiting_for_src_tx' || status?.status === 'failed';

  const { isExpired } = status ? isChannelExpired({ status }) : { isExpired: false };

  const onViewDetails = useCallback(() => {
    setViewDetails(!viewDetails);
  }, [viewDetails]);

  if (!status) {
    return isLoading ? (
      <div className="flex items-center justify-center">
        <LoadingSpinner />
      </div>
    ) : (
      <div>swap with id {router.query.swapId} not found</div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {status.status === 'completed' && (
        <motion.div
          key="completed"
          {...animationProps}
          className="flex items-stretch justify-center space-x-1"
        >
          <motion.div
            initial={false}
            animate={viewDetails ? { x: '-5%' } : { x: '38%' }}
            className="z-10"
            transition={{
              type: 'spring',
              damping: 15,
              stiffness: 80,
              restDelta: 0.01,
              mass: 1,
            }}
          >
            <SwapCompletedCard status={status} onViewDetails={onViewDetails} />
          </motion.div>
          <motion.div
            initial="exit"
            animate={viewDetails ? 'enter' : 'exit'}
            variants={animateDetails}
            transition={{
              type: 'spring',
              damping: 15,
              stiffness: 90,
              restDelta: 0.01,
              mass: 1,
            }}
          >
            <SwapEventLog status={status} className="h-full w-[327px]" />
          </motion.div>
        </motion.div>
      )}
      {status.status === 'failed' && (
        <motion.div {...animationProps} className="flex items-stretch justify-center space-x-6">
          <SwapFailedCard status={status} />
          <SwapEventLog status={status} className="w-[327px]" />
        </motion.div>
      )}
      {isWaitingRoomStatus && (
        <motion.div
          key="waiting-room"
          {...animationProps}
          className="flex items-stretch justify-center space-x-6"
        >
          <SwapBroadcastCard status={status} />
          <SwapEventLog status={status} className="w-[327px]" />
        </motion.div>
      )}
      {inProgressStates.includes(status.status) && !isWaitingRoomStatus && (
        <motion.div
          key="in-progress"
          {...animationProps}
          className="flex items-center justify-center"
        >
          <div className="flex items-start space-x-6">
            <div className="relative h-full w-[327px]">
              {showBackButton && (
                <button
                  type="button"
                  className="absolute top-[-30px] inline-flex items-center space-x-2 text-14 text-cf-light-3"
                  onClick={() => router.push('/')}
                >
                  <ArrowBackIcon />
                  <span> Back </span>
                </button>
              )}
              <div className="flex flex-col space-y-6">
                <SwapStatusCard status={status} />
                {!isExpired && <SwapEventLog status={status} className="max-h-[200px]" />}
              </div>
            </div>
            <SwapRouteCard status={status} refreshQuote={refreshStatus} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
