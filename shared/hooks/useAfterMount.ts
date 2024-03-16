import { useEffect, useRef } from 'react';

const useAfterMount: typeof useEffect = (effect, deps) => {
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }

    // eslint-disable-next-line consistent-return
    return effect();
  }, deps);
};

export default useAfterMount;
