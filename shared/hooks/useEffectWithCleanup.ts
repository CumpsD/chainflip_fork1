import { type DependencyList, useEffect } from 'react';

type Cleanup = () => void;

export default function useEffectWithCleanup(
  effect: (enqueue: (cleanup: Cleanup) => void) => void,
  deps: DependencyList,
) {
  useEffect(() => {
    const callbacks = [] as Cleanup[];

    effect((cb) => callbacks.push(cb));

    return () => {
      callbacks.forEach((cb) => cb());
    };
  }, deps);
}
