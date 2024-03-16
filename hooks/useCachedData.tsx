import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { type Subscription, type Observable } from 'rxjs';

type Data<T> = { value: T; isLoading: boolean };

type FetchData<Key, Value> = (key: Key) => Observable<Value>;

interface Context<Key extends string | number | symbol, Value> {
  cacheMap: Partial<Record<Key, Data<Value>>>;
  watch(key: Key | undefined): (() => void) | void;
}

type Cache<Key extends string | number | symbol, Value> = Partial<Record<Key, Data<Value>>>;

export default function useCachedData<Key extends string | number | symbol, Value>(
  fetchData: FetchData<Key, Value>,
  defaultValue: Value,
): [({ children }: { children: ReactNode }) => JSX.Element, (key: Key | undefined) => Data<Value>] {
  const CacheContext = createContext<Context<Key, Value> | undefined>(undefined);

  const CacheProvider = ({ children }: { children: React.ReactNode }) => {
    const [cacheMap, setCacheMap] = useState<Cache<Key, Value>>({});
    const counts = useRef({} as Record<Key, number>);
    const subscriptions = useRef({} as Record<Key, Subscription>);
    const cacheRef = useRef<Cache<Key, Value>>({});

    const triggerUpdate = () => setCacheMap({ ...cacheRef.current });

    const watch = useCallback((key: Key | undefined) => {
      if (key === undefined) return undefined;

      counts.current[key] ??= 0;
      counts.current[key] += 1;

      if (!cacheRef.current[key]) {
        const observable$ = fetchData(key);

        cacheRef.current[key] = { value: defaultValue, isLoading: true };

        triggerUpdate();

        const subscription = observable$.subscribe({
          complete() {
            const value = cacheRef.current[key];
            if (value) value.isLoading = false;
            triggerUpdate();
          },
          next(newValue) {
            const value = cacheRef.current[key];
            if (value) value.value = newValue;
            triggerUpdate();
          },
        });
        subscriptions.current[key] = subscription;
      }

      return () => {
        counts.current[key] -= 1;

        if (counts.current[key] === 0) {
          delete cacheRef.current[key];
          triggerUpdate();
          subscriptions.current[key].unsubscribe();
        }
      };
    }, []);

    const data = useMemo(() => ({ cacheMap, watch }), [cacheMap, watch]) as Context<Key, Value>;

    return <CacheContext.Provider value={data}>{children}</CacheContext.Provider>;
  };

  const useCache = (key: Key | undefined): Data<Value> => {
    const context = useContext(CacheContext);

    if (context === undefined) {
      throw new Error('useCache must be used within a CacheProvider');
    }

    const { watch, cacheMap } = context;

    useEffect(() => watch(key), [key]);

    if (key === undefined) return { value: defaultValue, isLoading: false };

    return (key && cacheMap[key]) ?? { value: defaultValue, isLoading: true };
  };

  return [CacheProvider, useCache];
}
