import { useEffect, useState } from 'react';

/**
 * Have you ever wanted to watch for an object to change but dgaf if the two
 * objects you are comparing have the same reference? Well, this is the hook
 * for you!
 * @param obj the object to watch
 * @param cmp a comparison function that returns true if the two objects are
 *            semantically equal
 * @returns the latest value of the object being watched
 */
export default function useWatchObject<T>(obj: T, cmp: (a: T, b: T) => boolean): T {
  const [state, setState] = useState(obj);

  useEffect(() => {
    if (!cmp(state, obj)) setState(obj);
  }, [obj, cmp]);

  return state;
}
