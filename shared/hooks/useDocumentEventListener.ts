import { useEffect, useRef } from 'react';

const useDocumentEventListener = <K extends keyof DocumentEventMap>(
  type: K,
  listener: (ev: DocumentEventMap[K]) => Promise<void> | void,
  options?: boolean | AddEventListenerOptions,
): void => {
  const listenerRef = useRef(listener);

  useEffect(() => {
    listenerRef.current = listener;
  }, [listener]);

  useEffect(() => {
    const handler: typeof listener = (event) => listenerRef.current(event);

    document.addEventListener(type, handler, options);

    return () => {
      document.removeEventListener(type, handler, options);
    };
  }, []);
};

export default useDocumentEventListener;
