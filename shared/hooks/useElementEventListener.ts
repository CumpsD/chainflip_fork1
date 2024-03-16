import { useEffect, useRef } from 'react';

const useElementEventListener = <K extends keyof HTMLElementEventMap>(
  element: HTMLElement | null,
  type: K,
  listener: (ev: HTMLElementEventMap[K]) => Promise<void> | void,
  options?: boolean | AddEventListenerOptions,
): void => {
  const listenerRef = useRef(listener);

  useEffect(() => {
    listenerRef.current = listener;
  }, [listener]);

  useEffect(() => {
    if (!element) return;

    const handler: typeof listener = (event) => listenerRef.current(event);

    element.addEventListener(type, handler, options);

    // eslint-disable-next-line consistent-return
    return () => {
      element.removeEventListener(type, handler, options);
    };
  }, [element]);
};

export default useElementEventListener;
