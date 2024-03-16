import { type DependencyList, useEffect, useRef } from 'react';

type Timer = ReturnType<typeof setTimeout>;

export default function useDebouncedEffect(
  effect: ({ signal }: { signal: AbortSignal }) => void,
  deps: DependencyList,
  ms: number,
) {
  const timer = useRef<Timer | null>(null);
  const controller = useRef(new AbortController());

  useEffect(() => {
    if (timer.current) {
      clearTimeout(timer.current);
    }

    timer.current = setTimeout(effect, ms, {
      signal: controller.current.signal,
    });
  }, deps);
}
