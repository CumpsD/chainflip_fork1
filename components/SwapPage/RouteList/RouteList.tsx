import { useCallback, useEffect, useMemo } from 'react';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import { Button, Tooltip } from '@/shared/components';
import useBoolean from '@/shared/hooks/useBoolean';
import useTracking from '@/shared/hooks/useTracking';
import RouteCard, { RouteCardLoading, RouteCardNotFound } from './RouteCard';
import { useCountdown } from '../../../hooks/useCountdown';
import useRoutes from '../../../hooks/useRoutes';
import useStore from '../../../hooks/useStore';
import { type RouteResponse } from '../../../integrations';
import { SwapEvents, type SwapTrackEvents } from '../../../types/track';
import { RouteRefreshTimer } from '../RouteRefreshTimer';

export const RouteList = () => {
  const track = useTracking<SwapTrackEvents>();
  const { routes, isLoading: routesLoading, refresh } = useRoutes();
  const { value: showingList, setFalse: hideList, setTrue: showList } = useBoolean(false);
  const secondsUntilNextRefresh = useCountdown(30, !routesLoading, refresh);
  const selectedRoute = useStore((state) => state.selectedRoute);
  const setSelectedRoute = useStore((state) => state.setSelectedRoute);

  useEffect(() => {
    setSelectedRoute(undefined);
  }, []);

  const memo = useMemo(() => {
    if (!routes.length) return undefined;

    const { best, worst } = routes.reduce(
      (acc, curr) => ({
        best: acc.best.destAmount > curr.destAmount ? acc.best : curr,
        worst: acc.worst.destAmount < curr.destAmount ? acc.worst : curr,
      }),
      { best: routes[0], worst: routes[0] },
    );

    const differenceFromWorstRoute = best.destAmount.sub(worst.destAmount).toFixed();

    const unSelectedRoutes = routes?.filter((route) => route.id !== selectedRoute?.id);
    const chainflipRoute = routes.find((route) => route.integration === 'chainflip');
    const recommendedRoute = chainflipRoute ?? best;

    return {
      bestRoute: best,
      differenceFromWorstRoute,
      unSelectedRoutes,
      recommendedRoute,
    };
  }, [routes, selectedRoute]);

  useEffect(() => {
    const updatedSelectedRoute =
      selectedRoute && routes.find((route) => route.id === selectedRoute.id);

    setSelectedRoute(updatedSelectedRoute ?? memo?.recommendedRoute);
  }, [routes, memo, selectedRoute]);

  const onRouteSelected = useCallback(
    (route: RouteResponse) => {
      if (selectedRoute?.id !== route.id) {
        track(SwapEvents.SelectRoute, {
          props: {
            assetFrom: `${route.srcToken.chain.name}.${route.srcToken.symbol}`,
            assetFromAmount: route.srcAmount.toFixed(),
            assetTo: `${route.destToken.chain.name}.${route.destToken.symbol}`,
            quotedAmount: route.destAmount.toFixed(),
            estRate: route.destAmount.ratio(route.srcAmount).toFixed(),
            isRecommended: route.id === memo?.recommendedRoute?.id,
            isNative: route.integration === 'chainflip',
            integration: route.integration,
          },
        });
      }
      setSelectedRoute(route);
      hideList();
    },
    [selectedRoute],
  );

  const spinner = (
    <RouteRefreshTimer
      isRefreshing={routesLoading}
      secondsUntilNextRefresh={secondsUntilNextRefresh}
    />
  );

  return (
    <div className="bg-holy-radial-gray-2-30 flex w-[450px] flex-col space-y-5 rounded-md border border-cf-gray-4 px-6 py-5">
      <div className="flex justify-between">
        <span className="cf-gray-gradient font-aeonikMedium text-20">Route</span>
        {spinner}
      </div>

      {routesLoading && routes.length === 0 && <RouteCardLoading />}
      {!routesLoading && routes.length === 0 && <RouteCardNotFound />}
      {selectedRoute && (
        <RouteCard
          route={selectedRoute}
          isSelected
          isSingleCard={!showingList}
          onRouteSelected={onRouteSelected}
          differenceFromWorstRoute={
            memo?.bestRoute.id === selectedRoute?.id ? memo?.differenceFromWorstRoute : undefined
          }
          spinner={spinner}
          isRecommended={memo?.recommendedRoute?.id === selectedRoute?.id}
        />
      )}

      <motion.div
        className={classNames(
          'space-y-5 overflow-hidden font-aeonikMedium text-12 text-cf-light-2',
          !showingList && '!my-0',
        )}
        animate={showingList ? 'open' : 'closed'}
        variants={{
          open: { height: 'auto', opacity: 1 },
          closed: { height: 0, opacity: 1 },
        }}
        transition={{ duration: 0.15 }}
        exit={{ opacity: 0, height: 0 }}
      >
        <div className="h-full w-full space-y-6">
          {memo?.unSelectedRoutes.map((route) => (
            <RouteCard
              key={route.id}
              route={route}
              onRouteSelected={onRouteSelected}
              differenceFromWorstRoute={
                memo.bestRoute.id === route.id ? memo.differenceFromWorstRoute : undefined
              }
              disabled={!showingList}
              isRecommended={memo?.recommendedRoute?.id === route?.id}
            />
          ))}
        </div>
      </motion.div>

      <Tooltip content="No other routes available" disabled={routes.length <= 1}>
        <Button
          className="flex w-full items-center justify-center"
          type="secondary-standard"
          onClick={() => {
            if (selectedRoute) {
              track(SwapEvents.ChangeRoute, {
                props: {
                  assetFrom: `${selectedRoute.srcToken.chain.name}.${selectedRoute.srcToken.symbol}`,
                  assetFromAmount: selectedRoute.srcAmount.toFixed(),
                  assetTo: `${selectedRoute.destToken.chain.name}.${selectedRoute.destToken.symbol}`,
                  quotedAmount: selectedRoute.destAmount.toFixed(),
                  currentIsRecommended: selectedRoute.id === memo?.recommendedRoute?.id,
                  currentIsNative: selectedRoute.integration === 'chainflip',
                  integration: selectedRoute.integration,
                },
              });
            }
            showList();
          }}
          disabled={routes.length <= 1}
        >
          <span className="text-14">Change route</span>
        </Button>
      </Tooltip>
    </div>
  );
};

export default RouteList;
