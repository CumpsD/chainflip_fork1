import { useCallback, useEffect, useRef, useState } from 'react';
import { useInterval } from '@/shared/hooks';

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const padSeconds = remainingSeconds.toString().padStart(2, '0');

  if (minutes > 0) {
    return `${minutes.toString().padStart(2, '0')}: ${padSeconds}`;
  }
  return `${remainingSeconds.toString().padStart(2, '0')}`;
};

export const useCountdown = (
  durationInSeconds: number,
  toggleTimer: boolean,
  callback: () => void,
) => {
  const [remainingSeconds, setRemainingSeconds] = useState(durationInSeconds);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const tick = useCallback(() => {
    setRemainingSeconds((prev) => {
      let newRemainingSeconds = prev - 1;
      if (newRemainingSeconds < 0) {
        callbackRef.current();
        newRemainingSeconds = durationInSeconds;
      }

      return newRemainingSeconds;
    });
  }, []);

  useInterval(tick, 1000);

  useEffect(() => {
    if (toggleTimer) {
      setRemainingSeconds(durationInSeconds);
    }
  }, [toggleTimer, durationInSeconds]);

  return formatTime(Math.max(0, remainingSeconds));
};
