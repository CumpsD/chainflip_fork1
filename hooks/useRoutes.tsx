import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useDebouncedEffect } from '@/shared/hooks';
import useBoolean from '@/shared/hooks/useBoolean';
import useStore, { selectShowRouteList } from './useStore';
import { integrationManager, type RouteResponse } from '../integrations';

interface RoutesData {
  routes: RouteResponse[];
  isLoading: boolean;
  refresh: () => void;
}

const RoutesContext = createContext<RoutesData | null>(null);

export const RoutesProvider = ({ children }: { children: React.ReactNode }) => {
  const { value: isLoading, setTrue: onLoadingStart, setFalse: onLoadingEnd } = useBoolean(false);
  const [routes, setRoutes] = useState<RouteResponse[]>([]);

  const showRouteList = useStore(selectShowRouteList);
  const srcToken = useStore((state) => state.srcToken);
  const destToken = useStore((state) => state.destToken);
  const srcAmount = useStore((state) => state.srcAmount);
  const destinationAddress = useStore((state) => state.destinationAddress);

  const refresh = () => {
    if (showRouteList && srcToken && destToken && srcAmount) {
      onLoadingStart();
      integrationManager
        .getRoutes({
          srcChainId: srcToken.chain.id,
          destChainId: destToken.chain.id,
          srcTokenAddress: srcToken.address,
          destTokenAddress: destToken.address,
          amount: BigInt(srcAmount.toString()),
          destAddress: destinationAddress,
        })
        .then(setRoutes)
        .catch((err) => {
          setRoutes([]);
          throw err;
        })
        .finally(onLoadingEnd);
    } else {
      setRoutes([]);
    }
  };

  const refreshDependencies = [srcToken, destToken, srcAmount, destinationAddress];
  useEffect(() => {
    // display loading indicator when params change before debounced function is called
    if (showRouteList) {
      setRoutes([]);
      onLoadingStart();
    }
  }, refreshDependencies);
  useDebouncedEffect(refresh, refreshDependencies, 500);

  const value = useMemo(() => ({ routes, isLoading, refresh }), [routes, isLoading, refresh]);

  return <RoutesContext.Provider value={value}>{children}</RoutesContext.Provider>;
};

const useRoutes = (): RoutesData => {
  const context = useContext(RoutesContext);
  if (context === null) {
    throw new Error('useRoutes must be used within a RoutesProvider');
  }
  return context;
};

export default useRoutes;
