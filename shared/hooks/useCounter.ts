import { useMemo } from 'react';
import useClampedValue from './useClampedValue';

interface UseCounterOptions {
  min?: number;
  start?: number;
  max: number;
}

export type Counter = {
  current: number;
  beginning: number;
  atBeginning: boolean;
  end: number;
  atEnd: boolean;
  increment(): void;
  decrement(): void;
  set(value: number): void;
  goToEnd(): void;
  goToBeginning(): void;
};

export default function useCounter({ start = 1, min = 1, max }: UseCounterOptions): Counter {
  const [current, setCurrent] = useClampedValue({ start, min, max });

  const counter = useMemo(
    () => ({
      current,
      beginning: min,
      atBeginning: current === min,
      end: max,
      atEnd: current === max,
      increment() {
        setCurrent((prev) => prev + 1);
      },
      decrement() {
        setCurrent((prev) => prev - 1);
      },
      set(value: number) {
        setCurrent(value);
      },
      goToEnd() {
        setCurrent(max);
      },
      goToBeginning() {
        setCurrent(min);
      },
    }),
    [current, min, max, setCurrent],
  );

  return counter;
}
