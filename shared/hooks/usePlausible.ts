import { useEffect } from 'react';

const usePlausible = () => {
  useEffect(() => {
    const plausibleScript = document.getElementById('plausible');
    if (!plausibleScript && !window.location.host.includes('localhost')) {
      const script = document.createElement('script');
      script.id = 'plausible';
      script.async = true;
      script.defer = true;
      script.dataset.api = '/api/event';
      script.dataset.domain = window.location.host; // Set script data-domain dynamically
      script.src = '/js/script.js';
      document.head.append(script);
    }
  }, []);
};

export default usePlausible;
