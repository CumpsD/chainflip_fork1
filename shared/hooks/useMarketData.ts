import { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { type CandlestickData } from '@/shared/graphql/generated/graphql';
import { getMarketData } from '@/shared/graphql/queries';
import { type ChainflipAsset } from '@/shared/utils/chainflip';
import { aggregateMarketData } from '../utils/marketData';

export default function useMarketData({
  numberOfDays,
  asset,
  resolution = 'HOURLY',
}: {
  numberOfDays: number;
  asset: ChainflipAsset;
  resolution?: 'DAILY' | 'HOURLY';
}) {
  const { data, loading, error } = useQuery(getMarketData, {
    variables: { asset, numberOfDays },
    skip: asset === undefined,
  });

  const marketData = useMemo(() => aggregateMarketData(data, resolution), [data, resolution]);

  const latestPrice = useMemo(
    () => data?.marketData.candlesticks.findLast((c): c is CandlestickData => 'close' in c)?.close,
    [data],
  );

  const earliestPrice = useMemo(
    () => data?.marketData.candlesticks.find((c): c is CandlestickData => 'close' in c)?.open,
    [data],
  );

  return {
    marketData,
    loading,
    error,
    latestPrice,
    earliestPrice,
  };
}
