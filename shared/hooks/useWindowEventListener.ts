import { useEffect, useRef } from 'react';

const useWindowEventListener = <K extends keyof WindowEventMap>(
  type: K,
  listener: (ev: WindowEventMap[K]) => Promise<void> | void,
  options?: boolean | AddEventListenerOptions,
): void => {
  const listenerRef = useRef(listener);

  useEffect(() => {
    listenerRef.current = listener;
  }, [listener]);

  useEffect(() => {
    const handler: typeof listener = (event) => listenerRef.current(event);

    window.addEventListener(type, handler, options);

    return () => {
      window.removeEventListener(type, handler, options);
    };
  }, []);
};

export default useWindowEventListener;
