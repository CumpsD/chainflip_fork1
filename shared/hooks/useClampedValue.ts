import { useCallback, useEffect, useState } from 'react';
import { clamp } from '../utils/numbers';

interface UseClampedValueOptions {
  start: number;
  min?: number;
  max?: number;
}

export default function useClampedValue({
  start,
  min = 1,
  max = Infinity,
}: UseClampedValueOptions): [number, React.Dispatch<React.SetStateAction<number>>] {
  const [value, setValue] = useState(clamp(start, min, max));

  const setClampedValue: React.Dispatch<React.SetStateAction<number>> = useCallback(
    (next) =>
      typeof next === 'number'
        ? setValue(clamp(next, min, max))
        : setValue((previous) => clamp(next(previous), min, max)),
    [min, max],
  );

  useEffect(() => {
    // reclamp the value if the callback changes
    setClampedValue((current) => current);
  }, [setClampedValue]);

  return [value, setClampedValue];
}
