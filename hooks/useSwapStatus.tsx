import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import type { SwapStatusResponse as ChainflipStatus } from '@chainflip/sdk/swap';
import { useQuery } from '@tanstack/react-query';
import { type Integration, integrationManager, isSupportedIntegration } from '../integrations';

export default function useSwapStatus() {
  const router = useRouter();
  const { integration, swapId } = router.query;
  const [isEnabled, setIsEnabled] = useState(true);
  const retainOldQuote = useRef(true);

  const {
    data: status,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ['swapStatus', integration, swapId],
    queryFn: async () =>
      (await integrationManager.getStatus(integration as Integration, swapId as string)) ?? null,
    refetchInterval: 5000,
    enabled: isEnabled && isSupportedIntegration(integration) && typeof swapId === 'string',
    structuralSharing: (oldData, newData) => {
      if (!oldData) return newData;

      if (retainOldQuote.current) {
        if (newData?.integration === 'chainflip') {
          const state = newData.integrationData?.state;
          // check if the route is actually only a quote
          if (state === 'AWAITING_DEPOSIT' || state === 'DEPOSIT_RECEIVED') {
            // eslint-disable-next-line no-param-reassign
            newData.route = oldData.route;
          }
        }
      }

      retainOldQuote.current = true;

      // chainflip state changes from AWAITING_DEPOSIT to BROADCAST_REQUESTED in one step most times
      // we want to interpolate the states in between to make the experience nicer for the user
      if (
        oldData?.integration === 'chainflip' &&
        newData?.integration === 'chainflip' &&
        newData.integrationData?.state === 'BROADCAST_REQUESTED'
      ) {
        if (
          !oldData.integrationData || // vault contract swaps have no integration data until deposit is witnessed
          oldData?.integrationData?.state === 'AWAITING_DEPOSIT'
        ) {
          // eslint-disable-next-line no-param-reassign
          (newData.integrationData as ChainflipStatus).state = 'DEPOSIT_RECEIVED';
        } else if (oldData?.integrationData?.state === 'DEPOSIT_RECEIVED') {
          // eslint-disable-next-line no-param-reassign
          (newData.integrationData as ChainflipStatus).state = 'SWAP_EXECUTED';
        }
      }

      return newData;
    },
  });

  const refreshStatus = () => {
    retainOldQuote.current = false;
    refetch();
  };

  const isWaitingRoomStatus =
    status != null &&
    status.integration === 'chainflip' &&
    status.integrationData?.state === 'BROADCAST_REQUESTED';

  useEffect(() => {
    const swapIsFinished =
      (status?.integration !== 'chainflip' && status?.status === 'completed') ||
      (status?.integration === 'chainflip' && status?.integrationData?.state === 'COMPLETE') ||
      status?.status === 'failed';

    setIsEnabled(!swapIsFinished);
  }, [status]);

  return {
    refreshStatus,
    isWaitingRoomStatus,
    status,
    isLoading: isLoading || !router.isReady,
  };
}
