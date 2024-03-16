import { useEffect, useMemo, useState } from 'react';
import { isNullish } from '@apollo/client/cache/inmemory/helpers';
import classNames from 'classnames';
import { type LineData } from 'lightweight-charts';
import { MacScrollbar } from 'mac-scrollbar';
import { ChainflipTransparentLogo } from '@/shared/assets/chain-transparent-logos';
import { type Token } from '@/shared/assets/tokens';
import {
  Modal,
  SkeletonLine,
  Tooltip,
  ChainTokenLogo,
  MarketDataChart,
  Link,
} from '@/shared/components';
import QuestionMarkTooltip from '@/shared/components/QuestionMarkTooltip';
import { useEffectWithCleanup } from '@/shared/hooks';
import useMarketData from '@/shared/hooks/useMarketData';
import { usePriceOracle } from '@/shared/hooks/usePriceOracle';
import useTracking from '@/shared/hooks/useTracking';
import { ArrowIcon } from '@/shared/icons/large';
import { ChartIcon } from '@/shared/icons/small';
import { TokenAmount, formatWithNumeral } from '@/shared/utils';
import { type BaseChainflipAsset } from '@/shared/utils/chainflip';
import { chainflipAssetMap, mapTokenToChainflipAsset } from '@/shared/utils/env';
import {
  type RouteResponse,
  type Integration,
  integrationManager,
  type ChainflipRouteResponse,
} from '../../integrations';
import { SwapEvents, type SwapTrackEvents } from '../../types/track';
import { getAmountFromRate } from '../../utils/helpers';
import Card from '../Card';
import ProtocolLink from '../ProtocolLink';

const Platform = ({ integration }: { integration: Integration }) => (
  <div className="flex items-center space-x-1">
    {integration === 'chainflip' && (
      <div className="flex h-4 w-4 items-center justify-center rounded-full bg-black">
        <ChainflipTransparentLogo className="h-3 w-3" />
      </div>
    )}
    <span className="text-14 text-cf-light-2">{integrationManager.getName(integration)}</span>
  </div>
);

type RouteStepBaseProps = {
  srcToken: Token;
  amount: string;
  usdAmount: string | JSX.Element;
};

type RouteStepWithDestProps = RouteStepBaseProps & {
  destToken: Token;
  protocolName: string;
  protocolLink: string;
};

type RouteStepProps = RouteStepBaseProps | RouteStepWithDestProps;

const RouteStep = ({ srcToken, amount, usdAmount, ...rest }: RouteStepProps) => {
  const isLastStep = !('destToken' in rest);

  return (
    <div className="flex flex-col justify-center space-y-3 last-of-type:pr-5">
      <div className="flex items-center justify-between space-x-6">
        <div className="flex items-center space-x-3">
          <ChainTokenLogo token={srcToken} />
          <div className="flex flex-col font-aeonikMono">
            <span className="whitespace-nowrap text-16 font-bold text-cf-white">
              {amount} {srcToken.symbol}
            </span>
            <span className="text-12 text-cf-light-2">{usdAmount}</span>
          </div>
        </div>
        {!isLastStep && <ArrowIcon className="text-cf-light-2" />}
      </div>
      <span className="text-12 text-cf-light-2">
        {isLastStep ? (
          <>
            User receives {amount} {srcToken.symbol}
          </>
        ) : (
          <>
            Swap from {srcToken.symbol} to {rest.destToken.symbol} via{' '}
            <ProtocolLink protocolLink={rest.protocolLink} protocolName={rest.protocolName} />
          </>
        )}
      </span>
    </div>
  );
};

const MarketDataCard = ({
  step,
  asset,
  setWidth,
  width,
}: {
  step: ChainflipRouteResponse['steps'][number];
  asset: BaseChainflipAsset;
  setWidth: (width: number) => void;
  width: number | undefined;
}) => {
  const [ref, setRef] = useState<HTMLDivElement | null>(null);
  const quoteAsset = chainflipAssetMap.Usdc;

  const estimatedSwapPrice =
    step.destToken === quoteAsset
      ? step.destAmount.ratio(step.srcAmount)
      : step.srcAmount.ratio(step.destAmount);

  const swapRateTokenAmount = TokenAmount.fromWholeUnits(estimatedSwapPrice, quoteAsset.decimals);
  const { marketData, latestPrice } = useMarketData({
    asset,
    numberOfDays: 3,
  });

  const lastIndexPrice = marketData?.prices.findLast((p): p is LineData => 'value' in p)?.value;

  const poolVolume24Hours = useMemo(
    () =>
      marketData?.volumes
        .slice(-24)
        .reduce((total, vol) => ('value' in vol ? total + vol.value : total), 0),
    [marketData],
  );

  const delta =
    lastIndexPrice === undefined
      ? undefined
      : estimatedSwapPrice.minus(lastIndexPrice).div(lastIndexPrice).times(100);

  const deltaColor = delta?.isPositive() ? 'text-cf-green-3' : 'text-cf-red-1';

  useEffectWithCleanup(
    (cleanup) => {
      if (!ref) return;

      const observer = new ResizeObserver((entries) => {
        setWidth(entries[0].borderBoxSize[0].inlineSize);
      });

      observer.observe(ref);

      cleanup(() => observer.disconnect());
    },
    [ref],
  );

  return (
    <Card
      ref={setRef}
      style={{ width: width && `${width}px` }}
      className="bg-holy-radial-gray-2-30 flex w-full min-w-fit items-stretch space-x-10 space-y-4 p-5 md:min-w-full"
    >
      <div className="flex flex-1 flex-col space-y-2">
        <div className="flex items-center space-x-1">
          <Link
            className="text-20 font-medium text-cf-white underline"
            target="_blank"
            href={`${process.env.NEXT_PUBLIC_EXPLORER_URL}/pools/${asset}`}
          >
            {chainflipAssetMap[asset].symbol}/{quoteAsset.symbol}
          </Link>
          &nbsp;·
          <div className="flex items-center space-x-1">
            <ChainflipTransparentLogo className="h-3 w-3" />
            <span className="text-14 text-cf-light-2">Chainflip</span>
          </div>
        </div>
        <div className="text-[34px] font-bold text-cf-white">
          {formatWithNumeral(latestPrice) ?? <SkeletonLine width={150} />}
        </div>
        <div className="flex flex-col space-y-1 ">
          {(
            [
              {
                label: 'Est. Rate',
                value: `${swapRateTokenAmount.toPreciseFixedDisplay()} ${quoteAsset.symbol}`,
              },
              {
                label: 'Price Delta',
                tooltip: 'The difference between the global index price and the estimated rate',
                value: !isNullish(delta) ? (
                  <span className={deltaColor}>{formatWithNumeral(delta.toFixed(2))}%</span>
                ) : (
                  <SkeletonLine width={100} />
                ),
              },
              {
                label: 'Index price',
                value: !isNullish(lastIndexPrice) ? (
                  <span>${formatWithNumeral(lastIndexPrice)}</span>
                ) : (
                  <SkeletonLine width={100} />
                ),
              },
              {
                label: 'Pool volume / 24h',
                value: !isNullish(poolVolume24Hours) ? (
                  <span>${formatWithNumeral(poolVolume24Hours)}</span>
                ) : (
                  <SkeletonLine width={100} />
                ),
              },
              {
                label: 'Global volume / 24h',
                value: !isNullish(marketData?.globalVolume) ? (
                  <span>${formatWithNumeral(marketData?.globalVolume)}</span>
                ) : (
                  <SkeletonLine width={100} />
                ),
              },
            ] as const
          ).map(({ label, value, ...rest }) => (
            <div key={label} className="flex items-center justify-between text-14">
              <div className="flex items-center space-x-2">
                <span className="text-cf-light-2">{label}</span>
                {'tooltip' in rest && <QuestionMarkTooltip content={rest.tooltip} />}
              </div>
              <span className="font-aeonikMono text-cf-white">{value}</span>
            </div>
          ))}
        </div>
      </div>
      <MarketDataChart marketData={marketData} width={600} height={300} />
    </Card>
  );
};

const Route = ({ route }: { route: RouteResponse }) => {
  const { watchTokens, getPrice, isLoading } = usePriceOracle();

  const handleUSDAmount = (amount: TokenAmount, token: Token) => {
    const rate = getPrice(token);
    if (!rate && isLoading) return <SkeletonLine />;
    if (!rate) return '$?';
    return `$${getAmountFromRate(amount, rate).toFixed(2)}`;
  };

  const steps = route.steps
    .map<RouteStepProps & { key: string }>((step) => ({
      key: `${step.srcToken.name}-${step.destToken.name}`,
      srcToken: step.srcToken,
      destToken: step.destToken,
      amount: step.srcAmount.toPreciseFixedDisplay(),
      usdAmount: handleUSDAmount(step.srcAmount, step.srcToken),
      protocolName: step.protocolName,
      protocolLink: step.protocolLink,
    }))
    .concat([
      {
        key: `${route.destToken.name}-dest`,
        srcToken: route.destToken,
        amount: route.destAmount.toPreciseFixedDisplay(),
        usdAmount: handleUSDAmount(route.destAmount, route.destToken),
      },
    ]);

  useEffect(
    () => watchTokens(steps.map((step) => step.srcToken)),
    steps.flatMap((step) => [step.srcToken.chain.id, step.srcToken.address]),
  );

  return (
    <div className="flex items-center space-x-6">
      {steps.map(({ key, ...step }) => (
        <RouteStep key={key} {...step} />
      ))}
    </div>
  );
};

export default function MarketData({
  disabled,
  spinner,
  route,
}: {
  disabled?: boolean;
  spinner?: JSX.Element;
  route?: RouteResponse;
}): JSX.Element | null {
  const track = useTracking<SwapTrackEvents>();
  const [showModal, setShowModal] = useState(false);
  const [width, setWidth] = useState<number>();

  if (!route) {
    setShowModal(false);
    return null;
  }

  const chainflipRoute = route.integration === 'chainflip';

  return (
    <>
      <Modal
        width="1024px"
        active={showModal}
        onCancel={() => setShowModal(false)}
        headingJSX={
          <div className="flex items-center space-x-6">
            <span className="cf-gray-gradient text-20 font-medium">Market Data</span>
            {spinner}
          </div>
        }
      >
        <MacScrollbar skin="dark" className="flex max-h-[80vh] min-w-full flex-col space-y-6">
          <Card
            className="bg-holy-radial-gray-2-30 flex min-w-full flex-col space-y-4 p-5"
            style={{ width: width && `${width}px` }}
          >
            <div className="flex items-center space-x-3">
              <span className="text-20 font-medium text-cf-white">Route</span>
              <Platform integration={route.integration} />
            </div>
            <Route route={route} />
          </Card>
          {route.integration === 'chainflip' &&
            route.steps.map((step) => {
              const token = step.destToken.chainflipId === 'Usdc' ? step.srcToken : step.destToken;

              const asset = mapTokenToChainflipAsset(
                token.chain.id,
                token.address,
              ) as BaseChainflipAsset;

              return (
                <MarketDataCard
                  step={step}
                  key={asset}
                  asset={asset}
                  setWidth={(newWidth) => setWidth((current) => Math.max(newWidth, current ?? 0))}
                  width={width}
                />
              );
            })}
        </MacScrollbar>
      </Modal>
      <Tooltip
        content="Only available for native swaps"
        disabled={chainflipRoute}
        tooltipClassName="w-[358px] "
      >
        <button
          type="button"
          disabled={!chainflipRoute || disabled}
          className={classNames(
            'flex w-full items-center justify-center space-x-1 rounded-md border border-cf-gray-4 bg-cf-gray-3 p-2 text-center font-aeonikMedium text-12 text-cf-light-3 transition',
            'disabled:cursor-not-allowed disabled:text-opacity-30',
            'enabled:hover:border-cf-gray-5 enabled:hover:bg-cf-gray-4 enabled:hover:text-cf-white',
          )}
          onClick={(e) => {
            e.stopPropagation();
            setShowModal(true);
            track(SwapEvents.ViewMarketData, {
              props: {
                assetFrom: `${route.srcToken.chain.name}.${route.srcToken.symbol}`,
                assetTo: `${route.destToken.chain.name}.${route.destToken.symbol}`,
              },
            });
          }}
        >
          <ChartIcon />
          <span>View market data</span>
        </button>
      </Tooltip>
    </>
  );
}
