/* eslint-disable no-continue */
import { BigNumber } from 'bignumber.js';
import { startOfDay } from 'date-fns';
import type * as lc from 'lightweight-charts';
import { type MarketData } from '@/shared/components/MarketDataChart';
import type * as gql from '@/shared/graphql/generated/graphql';
import { cloneObjects, pad } from '@/shared/utils';

const formatKey = (time: number) => {
  const day = startOfDay(time * 1000);
  return `${day.getFullYear()}-${pad(day.getMonth() + 1)}-${pad(day.getDate())}`;
};

const aggregateCandlesticks = (
  candlesticks: (gql.CandlestickData | gql.WhitespaceData)[],
): (lc.CandlestickData | lc.WhitespaceData)[] => {
  const aggregates = new Map<
    string,
    { time: string; open?: number; close?: number; high?: number; low?: number }
  >();

  for (const c of candlesticks) {
    const key = formatKey(c.time);

    const current = aggregates.get(key);
    if (!current) {
      if ('open' in c) {
        aggregates.set(key, { ...c, time: key });
      } else {
        aggregates.set(key, { time: key });
      }

      continue;
    }

    if (!('open' in c)) continue;

    current.open ??= c.open;
    current.close = c.close;
    current.high = Math.max(current.high ?? -Infinity, c.high);
    current.low = Math.min(current.low ?? Infinity, c.low);
  }

  return [...aggregates.values()];
};

const aggregateLineData = (data: gql.LineData[]): (lc.LineData | lc.WhitespaceData)[] => {
  const aggregates = new Map<string, { time: string; value?: number }>();

  for (const c of data) {
    const key = formatKey(c.time);
    const current = aggregates.get(key);
    if (!current) {
      aggregates.set(key, { value: c.value as number | undefined, time: key });
    }
  }

  return [...aggregates.values()];
};

const aggregateHistogramData = (
  data: (gql.HistogramData | gql.WhitespaceData)[],
): (lc.HistogramData | lc.WhitespaceData)[] => {
  const aggregates = new Map<string, { time: string; value?: BigNumber }>();

  for (const c of data) {
    const key = formatKey(c.time);
    const current = aggregates.get(key);
    if (!current) {
      if ('value' in c) {
        aggregates.set(key, { value: new BigNumber(c.value), time: key });
      } else {
        aggregates.set(key, { time: key });
      }

      continue;
    }
    if (!('value' in c)) continue;
    current.value ??= new BigNumber(0);
    current.value = current.value.plus(c.value);
  }

  return [...aggregates.values()].map((item) => ({
    time: item.time,
    value: item.value?.toNumber(),
  }));
};

export const aggregateMarketData = (
  data: { marketData: gql.MarketData } | undefined,
  resolution: 'HOURLY' | 'DAILY',
): MarketData | undefined => {
  if (!data || resolution === 'HOURLY') {
    return (data && {
      ...data,
      candlesticks: cloneObjects(data.marketData.candlesticks),
      prices: cloneObjects(data.marketData.prices),
      volumes: cloneObjects(data.marketData.volumes),
      globalVolume: data.marketData.globalVolume ?? 0,
    }) as MarketData | undefined;
  }

  return {
    candlesticks: aggregateCandlesticks(data.marketData.candlesticks),
    globalVolume: data.marketData.globalVolume ?? 0,
    prices: aggregateLineData(data.marketData.prices),
    volumes: aggregateHistogramData(data.marketData.volumes),
  };
};
