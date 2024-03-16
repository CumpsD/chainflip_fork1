import { useCallback, useEffect, useRef } from 'react';

const useInterval = (callback: () => void | Promise<void>, ms: number): void => {
  const callbackRef = useRef(callback);

  const intervalFunction = useCallback(() => {
    callbackRef.current();
  }, []);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const interval = setInterval(intervalFunction, ms);

    return () => {
      clearInterval(interval);
    };
  }, []);
};

export default useInterval;
