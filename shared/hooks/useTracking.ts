import { useCallback } from 'react';
import { getChainflipNetwork } from '@/shared/utils';

// https://docs.plausible.io/custom-event-goals#using-custom-props
type Props = Record<string, unknown> | string;

type EventOptions<P extends Props> = {
  props: P;
  // https://plausible.io/docs/ecommerce-revenue-tracking
  revenue?: {
    currency: string;
    amount: number;
  };
  // https://plausible.io/docs/custom-locations,
  u?: string;
  callback?: VoidFunction;
};

type EventOptionsTuple<P extends Props> = P extends string
  ? [Omit<EventOptions<P>, 'props'>?]
  : [EventOptions<P>];
type Events = { [K: string]: Props };

export default function useTracking<E extends Events>() {
  return useCallback(<N extends keyof E>(eventName: N, ...rest: EventOptionsTuple<E[N]>) => {
    // track custom events on mainnet only: https://linear.app/chainflip/issue/WEB-794/disable-plausible-events-on-perseverance
    if (getChainflipNetwork() !== 'mainnet') {
      return;
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).plausible?.(eventName, rest[0]);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      // TODO: capture in sentry
    }
  }, []);
}
