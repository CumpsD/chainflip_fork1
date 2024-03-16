import { useEffect, useState } from 'react';

const useMobile = (): boolean => {
  if (typeof window === 'undefined') return false;
  const [width, setWidth] = useState(window.innerWidth);
  const handleWindowSizeChange = () => {
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, []);

  return width <= 767;
};

export default useMobile;
