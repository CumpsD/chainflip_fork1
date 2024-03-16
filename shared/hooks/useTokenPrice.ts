import { useEffect, useMemo } from 'react';
import { type Token } from '@/shared/assets/tokens';
import { usePriceOracle } from './usePriceOracle';

const useTokenPrice = (token: Token | undefined) => {
  const priceOracle = usePriceOracle();

  const tokens = useMemo(() => (token ? [token] : []), [token?.chain.id, token?.address]);
  useEffect(() => priceOracle.watchTokens(tokens), [tokens]);

  return {
    isLoading: priceOracle.isLoading,
    price: token && priceOracle.getPrice(token),
  };
};

export default useTokenPrice;
