import { useEffect, useMemo } from 'react';
import { chainflipAssetMap } from '@/shared/utils';
import { type ChainflipAsset, chainflipAssets } from '@/shared/utils/chainflip';
import { usePriceOracle } from './usePriceOracle';

const useChainflipAssetPrices = () => {
  const priceOracle = usePriceOracle();

  const tokens = useMemo(() => chainflipAssets.map((asset) => chainflipAssetMap[asset]), []);
  useEffect(() => priceOracle.watchTokens(tokens), [tokens]);

  const prices = Object.fromEntries(
    chainflipAssets.map((asset) => [asset, priceOracle.getPrice(chainflipAssetMap[asset])]),
  ) as Record<ChainflipAsset, number | undefined>;

  return {
    isLoading: priceOracle.isLoading,
    prices,
  };
};

export default useChainflipAssetPrices;
