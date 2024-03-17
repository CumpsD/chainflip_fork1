import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import * as LightweightCharts from 'lightweight-charts';
import GraphLoader from '@/shared/components/GraphLoader';
import { useEffectWithCleanup } from '@/shared/hooks';
import { formatWithNumeral, isNullish, unreachable } from '@/shared/utils';
import GoDown from '@/shared/assets/svg/go-down'
import GoUp from '@/shared/assets/svg/go-up'

const getDateFromTime = (time: LightweightCharts.Time) => {
  if (typeof time === 'number') return new Date(time * 1000);
  if (typeof time === 'string') return new Date(time);
  return new Date(`${time.year}-${time.month}-${time.day}`);
};

const timeToHoursAndMinutes = (time: LightweightCharts.Time) =>
  getDateFromTime(time).toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: 'numeric',
  });

const timeToMonthAndDay = (time: LightweightCharts.Time) =>
  getDateFromTime(time).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'numeric',
  });

const formatLowerCrosshair = (time: LightweightCharts.Time) =>
  typeof time === 'number' ? timeToHoursAndMinutes(time) : timeToMonthAndDay(time);

type TooltipProps = {
  x?: number;
  y?: number;
  volume?: number;
  indexPrice?: number;
  poolPrice?: number;
  chartWidth?: number;
};

const Diff = ({
  indexPrice,
  poolPrice,
}: Required<Pick<TooltipProps, 'indexPrice' | 'poolPrice'>>) => {
  if (poolPrice === undefined || indexPrice === undefined) return null;
  const diff = poolPrice - indexPrice;
  const percent = (diff / indexPrice) * 100;

  const Icon = percent >= 0 ? GoUp : GoDown;
  const className = percent >= 0 ? 'text-cf-green-3' : 'text-cf-red-1';
  return (
    <div className={classNames(className, 'flex items-center space-x-1')}>
      <Icon />
      <div className={className}>{percent.toFixed(2)}%</div>
    </div>
  );
};

const Tooltip = ({ x, y, volume, indexPrice, poolPrice, chartWidth }: TooltipProps) => {
  if (!x || !y || !chartWidth) return null;

  return (
    <div
      className={classNames(
        'pointer-events-none absolute z-10 hidden min-w-[200px] -translate-y-1/2',
        'flex-col rounded-md border border-cf-gray-4 bg-cf-gray-4/60',
        'p-2 text-14 backdrop-blur-sm group-hover:flex',
        x > chartWidth / 2 ? 'translate-x-[calc((100%+0.25rem)*-1)]' : 'translate-x-1',
      )}
      style={{ left: x, top: y }}
    >
      <div>
        {(
          [
            ['Index Price', formatWithNumeral(indexPrice)],
            ['Pool Price', formatWithNumeral(poolPrice)],
            [
              'Price Delta',
              poolPrice && indexPrice && <Diff poolPrice={poolPrice} indexPrice={indexPrice} />,
            ],
            ['Volume', formatWithNumeral(volume)],
          ] as const
        ).map(
          ([label, value]) =>
            !isNullish(value) && (
              <div
                key={label}
                className="flex items-center justify-between space-x-4 whitespace-nowrap"
              >
                <div className="text-cf-light-3">{label}</div>
                <div>{value}</div>
              </div>
            ),
        )}
      </div>
    </div>
  );
};

export type MarketData = {
  candlesticks: (LightweightCharts.CandlestickData | LightweightCharts.WhitespaceData)[];
  globalVolume: number;
  prices: (LightweightCharts.LineData | LightweightCharts.WhitespaceData)[];
  volumes: (LightweightCharts.HistogramData | LightweightCharts.WhitespaceData)[];
};

const MarketDataChart = ({
  marketData,
  width,
  height,
  yAxisSide = 'right',
  horizontalLines = false,
}: {
  marketData: MarketData | undefined;
  width?: number;
  height?: number;
  yAxisSide?: 'left' | 'right';
  horizontalLines?: boolean;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [lwChart, setLWChart] = useState<LightweightCharts.IChartApi>();
  const [candlestickSeries, setCandlestickSeries] =
    useState<LightweightCharts.ISeriesApi<'Candlestick'>>();
  const [volumeSeries, setVolumeSeries] = useState<LightweightCharts.ISeriesApi<'Histogram'>>();
  const [lineSeries, setLineSeries] = useState<LightweightCharts.ISeriesApi<'Line'>>();
  const [tooltipInfo, setTooltipInfo] = useState<TooltipProps>();

  useEffect(() => {
    if (candlestickSeries && marketData) {
      candlestickSeries.setData(marketData.candlesticks);
    }
    if (volumeSeries && marketData) {
      volumeSeries.setData(marketData.volumes);
    }
    if (lineSeries && marketData) {
      lineSeries.setData(marketData.prices);
    }
    lwChart?.timeScale().fitContent();
  }, [candlestickSeries, marketData, volumeSeries, lineSeries]);

  useEffectWithCleanup(
    (cleanup) => {
      const div = ref.current;
      if (!div) return;

      const chart = LightweightCharts.createChart(div, {
        autoSize: true,
        crosshair: {
          mode: LightweightCharts.CrosshairMode.Normal,
          vertLine: {
            color: '#424242',
          },
          horzLine: {
            color: '#424242',
          },
        },
        leftPriceScale: {
          borderColor: '#424242',
          visible: yAxisSide === 'left',
          entireTextOnly: true,
        },
        rightPriceScale: {
          borderColor: '#424242',
          visible: yAxisSide === 'right',
          entireTextOnly: true,
        },
        layout: {
          fontFamily: 'Aeonik-Regular',
          background: {
            color: '#00000000',
          },
          textColor: '#CDCDCD',
        },
        grid: {
          vertLines: { visible: false },
          horzLines: {
            visible: horizontalLines,
            style: LightweightCharts.LineStyle.Dashed,
            color: '#424242',
          },
        },
        timeScale: {
          borderColor: '#424242',
          fixLeftEdge: true,
          fixRightEdge: true,
          timeVisible: true,
          tickMarkFormatter: (
            time: LightweightCharts.Time,
            type: LightweightCharts.TickMarkType,
          ) => {
            switch (type) {
              case LightweightCharts.TickMarkType.Year:
              case LightweightCharts.TickMarkType.Month:
              case LightweightCharts.TickMarkType.DayOfMonth:
                return timeToMonthAndDay(time);
              case LightweightCharts.TickMarkType.Time:
              case LightweightCharts.TickMarkType.TimeWithSeconds:
                return timeToHoursAndMinutes(time);
              default:
                return unreachable(type, `unexpected tick mark type: "${type}"`);
            }
          },
        },
        localization: {
          timeFormatter: formatLowerCrosshair,
          priceFormatter: (price: number) => formatWithNumeral(price, true),
        },
      });

      setLWChart(chart);

      const candles = chart.addCandlestickSeries({
        upColor: '#46DA93',
        wickUpColor: '#46DA93',
        borderUpColor: '#46DA93',
        downColor: '#F64848',
        wickDownColor: '#F64848',
        borderDownColor: '#F64848',
        priceScaleId: yAxisSide,
        lastValueVisible: false,
        priceLineVisible: false,
        priceFormat: {
          type: 'custom',
          formatter: ((price) =>
            !price || price < 0 ? '' : price.toFixed(2)) as LightweightCharts.PriceFormatterFn,
        },
      });

      setCandlestickSeries(candles);
      cleanup(() => setCandlestickSeries(undefined));

      const volume = chart.addHistogramSeries({
        color: '#424242',
        priceFormat: {
          type: 'volume',
        },
        priceScaleId: 'volume',
        lastValueVisible: false,
        priceLineVisible: false,
      });

      setVolumeSeries(volume);
      cleanup(() => setVolumeSeries(undefined));

      chart.priceScale('volume').applyOptions({
        scaleMargins: {
          top: 0.85,
          bottom: 0,
        },
      });

      const indexLine = chart.addLineSeries({
        lineStyle: LightweightCharts.LineStyle.Dashed,
        lineWidth: 1,
        color: '#909090',
        priceScaleId: yAxisSide,
        lastValueVisible: false,
        priceLineVisible: false,
        crosshairMarkerVisible: false,
      });

      setLineSeries(indexLine);
      cleanup(() => setLineSeries(undefined));

      chart.priceScale(yAxisSide).applyOptions({
        scaleMargins: { bottom: 0.2, top: 0 },
      });

      const handleMove: LightweightCharts.MouseEventHandler = (params) => {
        if (params.point === undefined) {
          setTooltipInfo(undefined);
          return;
        }

        const point = params.seriesData.get(indexLine) as LightweightCharts.LineData | undefined;
        const indexPrice = point?.value;
        const vol = params.seriesData.get(volume) as LightweightCharts.HistogramData | undefined;
        const candle = params.seriesData.get(candles) as
          | LightweightCharts.CandlestickData
          | undefined;
        setTooltipInfo({
          x: params.point.x + chart.priceScale('left').width(),
          y: params.point.y,
          volume: vol?.value,
          indexPrice,
          poolPrice: candle?.low,
          chartWidth: div.clientWidth,
        });
      };
      cleanup(() => chart.unsubscribeCrosshairMove(handleMove));

      chart.subscribeCrosshairMove(handleMove);

      cleanup(() => {
        chart.remove();
        setLWChart(undefined);
      });
    },
    [ref.current],
  );

  return (
    <GraphLoader
      loading={marketData === undefined}
      className={classNames(width === undefined && 'w-full', height === undefined && 'h-full')}
    >
      <div
        className={classNames('group relative h-full w-full', marketData === undefined && 'hidden')}
        style={{
          width: width && `${width}px`,
          height: height && `${height}px`,
        }}
        ref={ref}
      >
        <Tooltip {...tooltipInfo} />
      </div>
    </GraphLoader>
  );
};

export default MarketDataChart;
