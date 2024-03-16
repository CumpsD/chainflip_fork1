import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  btc$,
  dot$,
  eth$,
  flip$,
  geth$,
  gusdc$,
  matic$,
  mumbaiMatic$,
  pdot$,
  tbtc$,
  tflip$,
  type Token,
  usdc$,
  bflip$,
  busdc$,
  beth$,
} from '@/shared/assets/tokens';
import { useInterval } from '@/shared/hooks';
import useBoolean from '@/shared/hooks/useBoolean';
import { fetchTokenPrices } from '../utils/fetchTokenPrices';

type Timeout = ReturnType<typeof setTimeout>;
type PriceOracleContextValue = {
  watchTokens: (tokens: Token[]) => () => void;
  getPrice: (token: Token) => number | undefined;
  isLoading: boolean;
};
const PriceOracleContext = createContext<PriceOracleContextValue | undefined>(undefined);

const getTokenKey = (token: Token | { address: string; chainId: string }) => {
  const chainId = 'chain' in token ? token.chain.id : token.chainId;
  return `${chainId}-${token.address}`.toLowerCase();
};

const getMainnetToken = (token: Token) => {
  // load prices of mainnet token to get realistic prices for testnet tokens
  if (getTokenKey(token) === getTokenKey(tflip$)) return flip$;
  if (getTokenKey(token) === getTokenKey(tbtc$)) return btc$;
  if (getTokenKey(token) === getTokenKey(pdot$)) return dot$;
  if (getTokenKey(token) === getTokenKey(geth$)) return eth$;
  if (getTokenKey(token) === getTokenKey(gusdc$)) return usdc$;
  if (getTokenKey(token) === getTokenKey(mumbaiMatic$)) return matic$;
  if (getTokenKey(token) === getTokenKey(bflip$)) return flip$;
  if (getTokenKey(token) === getTokenKey(busdc$)) return usdc$;
  if (getTokenKey(token) === getTokenKey(beth$)) return eth$;
  return token;
};

const REFRESH_PRICES_INTERVAL_SECONDS = 10;

export const PriceOracleProvider = ({ children }: { children: ReactNode }) => {
  const { current: watchedTokens } = useRef<Record<string, { count: number; token: Token }>>({});
  const [loadedPrices, setLoadedPrices] = useState<Record<string, number>>({});
  const {
    value: isLoading,
    setTrue: setIsLoadingTrue,
    setFalse: setIsLoadingFalse,
  } = useBoolean(false);

  const refreshPrices = useCallback(() => {
    const tokens = Object.values(watchedTokens)
      .filter((entry) => entry.count > 0)
      .map((entry) => entry.token);

    setIsLoadingTrue();
    fetchTokenPrices(tokens.map(getMainnetToken))
      .then((prices) => {
        const newPrices = prices.reduce(
          (prev, cur) => ({ ...prev, [getTokenKey(cur)]: cur.usdPrice }),
          {} as Record<string, number>,
        );
        setLoadedPrices((oldPrices) => ({ ...oldPrices, ...newPrices }));
      })
      .finally(setIsLoadingFalse);
  }, []);

  // debounce refreshPrices call to prevent multiple calls during a single render
  const refreshPricesTimeout = useRef<Timeout>();
  const debouncedRefreshPrices = useCallback(() => {
    if (refreshPricesTimeout.current) clearTimeout(refreshPricesTimeout.current);
    refreshPricesTimeout.current = setTimeout(refreshPrices, 100);
  }, []);

  const watchTokens = useCallback((tokens: Token[]) => {
    const tokenKeys = tokens.map(getTokenKey);

    for (const [index, tokenKey] of tokenKeys.entries()) {
      if (!watchedTokens[tokenKey] || watchedTokens[tokenKey].count <= 0) {
        watchedTokens[tokenKey] = { token: tokens[index], count: 0 };
        debouncedRefreshPrices();
      }
      watchedTokens[tokenKey].count += 1;
    }

    return () => {
      for (const tokenKey of tokenKeys) {
        if (watchedTokens[tokenKey]) watchedTokens[tokenKey].count -= 1;
      }
    };
  }, []);

  const getPrice = useCallback(
    (token: Token) => loadedPrices[getTokenKey(getMainnetToken(token))],
    [loadedPrices],
  );

  useInterval(debouncedRefreshPrices, REFRESH_PRICES_INTERVAL_SECONDS * 1000);

  const context = useMemo(
    () => ({
      watchTokens,
      getPrice,
      isLoading,
    }),
    [watchTokens, getPrice, isLoading],
  );

  return <PriceOracleContext.Provider value={context}>{children}</PriceOracleContext.Provider>;
};

export const usePriceOracle = () => {
  const context = useContext(PriceOracleContext);
  if (context === undefined) {
    throw new Error('usePriceOracle must be used within a PriceOracleContext');
  }

  return context;
};
