import { Fragment, type ReactNode, useEffect, useState, useRef } from 'react';
import BigNumber from 'bignumber.js';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import { Link, TokenLogo, Tooltip } from '@/shared/components';
import QuestionMarkTooltip from '@/shared/components/QuestionMarkTooltip';
import RouteTooltip from '@/shared/components/RouteTooltip';
import { isTestnet } from '@/shared/featureFlags';
import { usePriceOracle } from '@/shared/hooks/usePriceOracle';
import ArrowRightIcon from '@/shared/icons/ArrowRight';
import Chevron from '@/shared/icons/flip-ui-kit/large/Chevron';
import { Switch2Icon } from '@/shared/icons/small';
import {
  abbreviate,
  formatWithNumeral,
  TokenAmount,
  intervalToDurationWords,
  isNullish,
} from '@/shared/utils';
import { UsdAmount } from './UsdAmount';
import usePriceDelta from '../hooks/usePriceDelta';
import {
  type RouteResponse,
  integrationManager,
  type StatusResponse,
  type ChainflipRouteResponse,
} from '../integrations';
import { EGRESS_FEE, INGRESS_FEE, NETWORK_FEE, POOL_FEE } from '../utils/consts';

export const RouteLabelValue = ({
  label,
  children,
  tooltip,
}: {
  label: string;
  children: React.ReactNode | string;
  tooltip?: string;
}) => (
  <div className="flex w-full items-center justify-between text-12">
    <div className="flex items-center space-x-2">
      <span className="text-cf-light-2">{label}</span>
      <QuestionMarkTooltip content={tooltip} />
    </div>
    {typeof children === 'string' ? (
      <span className="font-aeonikMono text-white">{children}</span>
    ) : (
      children
    )}
  </div>
);

const RouteSection = ({ route, disabled }: { route: RouteResponse; disabled: boolean }) => {
  const [showRouteDetails, setShowRouteDetails] = useState<boolean>(false);

  const steps = (
    <div className="flex items-center justify-around space-x-1">
      {route.steps.map((step, index) => (
        <Fragment key={step.protocolName + step.srcToken.symbol}>
          <TokenLogo token={step.srcToken} height={16} width={16} />
          <ArrowRightIcon className="text-cf-light-1" width="16px" height="16px" />
          {index === route.steps.length - 1 && (
            <TokenLogo token={step.destToken} width={16} height={16} />
          )}
        </Fragment>
      ))}
    </div>
  );

  if (route.integration === 'chainflip') {
    return (
      <RouteLabelValue label="Route">
        <Tooltip
          content={
            <RouteTooltip
              type="Route"
              swap={{
                sourceAsset: route.srcToken.chainflipId,
                depositAmount: route.srcAmount.toString(),
                destinationAsset: route.destToken.chainflipId,
                egressAmount: route.destAmount.toString(),
                intermediateAmount:
                  route.steps.length === 2 ? route.steps[1].srcAmount.toString() : undefined,
              }}
            />
          }
        >
          {steps}
        </Tooltip>
      </RouteLabelValue>
    );
  }

  return (
    <>
      <RouteLabelValue label="Route">
        <div className="flex items-center justify-around">
          {steps}

          <button
            type="button"
            disabled={disabled}
            onClick={(e) => {
              e.stopPropagation();
              setShowRouteDetails(!showRouteDetails);
            }}
          >
            <Chevron
              flip={!showRouteDetails}
              className="cursor-pointer text-cf-light-3 duration-100"
            />
          </button>
        </div>
      </RouteLabelValue>

      <motion.div
        className="!mt-0 h-0 overflow-hidden font-aeonikMedium text-12 text-cf-light-2"
        animate={showRouteDetails ? 'open' : 'closed'}
        variants={{
          open: { height: 'auto', opacity: 1 },
          closed: { height: '0px', opacity: 0 },
        }}
        transition={{ duration: 0.15 }}
      >
        <div className="mt-2 flex flex-col space-y-2">
          {route.steps.map((step) => (
            <div key={step.protocolName + step.srcToken.symbol}>
              <div className="ml-1 flex items-end space-x-1">
                <div className="text-cf-light-2">
                  Swap{' '}
                  <span className="font-aeonikMono font-semibold">
                    {step.srcAmount.toPreciseFixedDisplay()}
                  </span>{' '}
                  {step.srcToken.symbol} to{' '}
                  <span className="font-aeonikMono font-semibold">
                    {step.destAmount.toPreciseFixedDisplay()}
                  </span>{' '}
                  {step.destToken.symbol} via {step.protocolName}
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </>
  );
};

const TooltipContentRow = ({ children }: { children: ReactNode }) => (
  <div className="flex items-center justify-between space-x-9 whitespace-nowrap">{children}</div>
);

const InfoTooltipContent = ({
  route,
  priceOracle,
  type,
}: {
  route: ChainflipRouteResponse;
  priceOracle: ReturnType<typeof usePriceOracle>;
  type: 'platform' | 'gas';
}) => {
  const feeToUsdString = (fee: ChainflipRouteResponse['platformFees'][number]) => {
    const feeUsd = fee.amount.mul(priceOracle.getPrice(fee.token) ?? 0).toBigNumber();

    let feeUsdString;

    if (feeUsd.gt(0)) {
      if (feeUsd.lt(0.01)) {
        feeUsdString = `<$0.01`;
      } else {
        feeUsdString = `$${feeUsd.toFixed(2)}`;
      }
    }

    return feeUsdString;
  };

  let items: ReactNode[] = [];
  if (type === 'gas') {
    const ingressFee = route.platformFees.find((fee) => fee.name === INGRESS_FEE);
    const egressFee = route.platformFees.find((fee) => fee.name === EGRESS_FEE);

    const ingressFeeUsd = ingressFee && feeToUsdString(ingressFee);
    const egressFeeUsd = egressFee && feeToUsdString(egressFee);
    items = [
      ingressFeeUsd && (
        <TooltipContentRow>
          <div className="flex items-center gap-x-2">
            <TokenLogo className="z-[1]" token={ingressFee.token} height={16} width={16} />
            {INGRESS_FEE}
          </div>
          <div className="font-aeonikMono">
            <span className="text-cf-white">
              {ingressFee?.amount.toPreciseFixedDisplay()} {ingressFee?.token.symbol}{' '}
            </span>
            {ingressFeeUsd && <>({ingressFeeUsd})</>}
          </div>
        </TooltipContentRow>
      ),
      egressFeeUsd && (
        <TooltipContentRow>
          <div className="flex items-center gap-x-2">
            <TokenLogo className="z-[1]" token={egressFee.token} height={16} width={16} />
            {EGRESS_FEE}
          </div>
          <div className="font-aeonikMono">
            <span className="text-cf-white">
              {egressFee?.amount.toPreciseFixedDisplay()} {egressFee?.token.symbol}{' '}
            </span>
            {egressFeeUsd && <>({egressFeeUsd})</>}
          </div>
        </TooltipContentRow>
      ),
    ];
  } else if (type === 'platform') {
    const networkFee = route.platformFees.find((fee) => fee.name === NETWORK_FEE);
    const poolFees = route.platformFees.filter((fee) => fee.name === POOL_FEE);

    items = [
      ...poolFees.map((fee, feeIndex) => {
        const feeUsdString = feeToUsdString(fee);

        const tokens =
          route.steps.length === 2
            ? [
                [route.steps[0].srcToken, route.steps[0].destToken],
                [route.steps[1].destToken, route.steps[1].srcToken],
              ]
            : [[route.steps[0].srcToken, route.steps[0].destToken]];

        const [src, dest] = tokens[feeIndex];

        return (
          <TooltipContentRow>
            <div className="flex items-center gap-x-2">
              <div className="flex items-center -space-x-1">
                <TokenLogo className="z-[1]" token={src} height={16} width={16} />
                <TokenLogo token={dest} height={16} width={16} />
              </div>
              {POOL_FEE}
            </div>
            <div className="font-aeonikMono">
              <span className="text-cf-white">
                {fee?.amount.toPreciseFixedDisplay()} {fee?.token.symbol}{' '}
              </span>
              {feeUsdString && <>({feeUsdString})</>}
            </div>
          </TooltipContentRow>
        );
      }),
      <TooltipContentRow>
        <span>{NETWORK_FEE}</span>
        <span className="font-aeonikMono text-cf-white">
          {networkFee?.amount.toPreciseFixedDisplay()} {networkFee?.token.symbol}
        </span>
      </TooltipContentRow>,
    ];
  }

  return (
    <div className="flex min-w-[260px] flex-col space-y-2">
      {items.map((content, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <Fragment key={index}>{content}</Fragment>
      ))}
      {type === 'platform' && (
        <>
          <div className="h-[1px] bg-cf-gray-4" />
          <div>
            Fixed fee taken in $USDC by the protocol to buy and burn $FLIP.{' '}
            <Link
              href="https://docs.chainflip.io/concepts/token-economics/incentive-design-emission-and-burning#the-network-fee"
              target="_blank"
              color="green"
            >
              Learn more
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

const PlatformFees = ({
  isSettledCard,
  disabled,
  route,
}: {
  route: RouteResponse;
  isSettledCard: boolean;
  disabled: boolean;
}) => {
  const [expandPlatformFees, setExpandPlatformFees] = useState(false);

  const priceOracle = usePriceOracle();
  useEffect(() => priceOracle.watchTokens(route.platformFees.map(({ token }) => token)), [route]);

  if (route.platformFees.length === 0) return null;

  const totalPlatformFeeUsd = BigNumber.sum(
    ...route.platformFees
      .filter((fee) => fee.name === POOL_FEE || fee.name === NETWORK_FEE)
      .map((fee) => fee.amount.mul(priceOracle.getPrice(fee.token) ?? 0).toBigNumber()),
  ).toNumber();

  const totalGasFee = BigNumber.sum(
    ...route.platformFees
      .filter((fee) => fee.name === INGRESS_FEE || fee.name === EGRESS_FEE)
      .map((fee) => fee.amount.mul(priceOracle.getPrice(fee.token) ?? 0).toBigNumber()),
  );

  const totalGasFeeUsd = totalGasFee.lt(0.01) ? '<$0.01' : `$${totalGasFee.toFixed(2)}`;

  if (route.integration === 'chainflip') {
    return (
      <>
        <RouteLabelValue label={isSettledCard ? 'Platform Fees' : 'Est. Platform fees'}>
          <Tooltip
            content={<InfoTooltipContent type="platform" route={route} priceOracle={priceOracle} />}
          >
            <div className="flex items-center justify-end">
              <span className="font-aeonikMono text-white underline decoration-dotted">
                ${formatWithNumeral(totalPlatformFeeUsd, true)}
              </span>
            </div>
          </Tooltip>
        </RouteLabelValue>
        <RouteLabelValue label={isSettledCard ? 'Gas Fees' : 'Est. Gas fees'}>
          <Tooltip
            content={<InfoTooltipContent type="gas" route={route} priceOracle={priceOracle} />}
          >
            <div className="flex items-center justify-end">
              <span className="font-aeonikMono text-white underline decoration-dotted">
                {totalGasFeeUsd}
              </span>
            </div>
          </Tooltip>
        </RouteLabelValue>
      </>
    );
  }

  return (
    <>
      <RouteLabelValue label={isSettledCard ? 'Platform Fees' : 'Est. Platform fees'}>
        <div className="flex items-center justify-around">
          <span className="font-aeonikMono text-white">
            ${formatWithNumeral(totalPlatformFeeUsd)}
          </span>

          <button
            disabled={disabled}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setExpandPlatformFees(!expandPlatformFees);
            }}
          >
            <Chevron
              width={20}
              height={20}
              flip={!expandPlatformFees}
              className="cursor-pointer text-cf-light-3 duration-100"
            />
          </button>
        </div>
      </RouteLabelValue>

      <motion.div
        className="!mt-0 h-0 overflow-hidden text-12"
        animate={expandPlatformFees ? 'open' : 'closed'}
        variants={{
          open: { height: 'auto', opacity: 1, marginTop: 'auto' },
          closed: { height: '0px', opacity: 0, marginTop: '0px' },
        }}
        transition={{ duration: 0.15 }}
      >
        <div className="flex w-full flex-col space-y-2 pt-2 transition">
          <div className="flex w-full flex-col space-y-2 pl-1">
            {route.platformFees.map((fee, index) => (
              <div
                className="flex w-full items-center justify-between"
                key={index} // eslint-disable-line react/no-array-index-key
              >
                <span className="text-cf-light-2">{fee.name}</span>
                <div className="font-aeonikRegular text-cf-light-2">
                  <span className="text-white">
                    <span className="font-aeonikMono">{fee.amount.toFixedDisplay()}</span>{' '}
                    {fee.token.symbol}{' '}
                  </span>
                  (<UsdAmount token={fee.token} tokenAmount={fee.amount} />)
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </>
  );
};

export const SwapDetails = ({
  route,
  duration,
  isSettledCard = false,
  showDestinationAddress = false,
  disabled = false,
}: {
  route: RouteResponse;
  duration?: StatusResponse['duration'];
  isSettledCard?: boolean;
  showDestinationAddress?: boolean;
  disabled?: boolean;
}) => {
  const [showInverseRate, setShowInverseRate] = useState(false);
  const initialRender = useRef(true);

  const onSwitch = () => {
    initialRender.current = false;
    setShowInverseRate(!showInverseRate);
  };

  const switchAnimate = () => {
    if (initialRender.current) return 'none';
    if (!showInverseRate) return 'flash';
    return 'flash2';
  };

  const rate = TokenAmount.fromWholeUnits(
    !showInverseRate
      ? route.destAmount.ratio(route.srcAmount)
      : route.srcAmount.ratio(route.destAmount),
    !showInverseRate ? route.destToken.decimals : route.srcToken.decimals,
  );

  const { delta, color } = usePriceDelta({
    srcAmount: route.srcAmount,
    destAmount: route.destAmount,
    srcAsset: route.srcToken,
    destAsset: route.destToken,
  });

  let destinationAddress: string | undefined;
  if (route.integration === 'chainflip') {
    destinationAddress = route.integrationData.destAddress;
    // } else if (route.integration === 'lifi') {
    //   destinationAddress = route.integrationData.toAddress ?? '';
  } else if (route.integration === 'squid') {
    destinationAddress = route.integrationData.params.toAddress;
  }

  const integrationName = integrationManager.getName(route.integration);
  const IntegrationLogo = integrationManager.getLogo(route.integration);

  return (
    <div className="w-full space-y-3 text-12">
      {isSettledCard && destinationAddress && (
        <RouteLabelValue label="Destination Wallet">
          {abbreviate(destinationAddress)}
        </RouteLabelValue>
      )}

      <RouteSection route={route} disabled={disabled} />

      {!isSettledCard && (
        <RouteLabelValue label="Protocol">
          <div className="flex items-center justify-around space-x-1">
            <IntegrationLogo width={16} height={16} />
            <span className="font-aeonikMedium text-white">{integrationName}</span>
          </div>
        </RouteLabelValue>
      )}

      <PlatformFees route={route} disabled={disabled} isSettledCard={isSettledCard} />

      {route.gasFees.map((fee, index) => (
        <RouteLabelValue
          label={isSettledCard ? 'Gas fees' : 'Est. Gas fees'}
          key={index} // eslint-disable-line react/no-array-index-key
        >
          <div className="font-aeonikRegular text-cf-light-2">
            <span className="text-white">
              <span className="font-aeonikMono">{fee.amount.toFixedDisplay()}</span>{' '}
              {fee.token.symbol}{' '}
            </span>
            (<UsdAmount token={fee.token} tokenAmount={fee.amount} />)
          </div>
        </RouteLabelValue>
      ))}

      <RouteLabelValue label={isSettledCard ? 'Rate' : 'Est. Rate'}>
        <motion.button
          animate={switchAnimate()}
          variants={{
            none: { opacity: 1 },
            flash: { opacity: [0, 1] },
            flash2: { opacity: [0, 1] },
          }}
          transition={{ duration: 0.3 }}
          className="inline-flex items-center gap-x-1 font-aeonikRegular text-cf-light-3 transition ease-in hover:text-white"
          onClick={onSwitch}
        >
          <span className="font-aeonikMono">1</span>{' '}
          {showInverseRate ? route.destToken.symbol : route.srcToken.symbol}
          <Switch2Icon className="cursor-pointer" />
          <span className="font-aeonikMono">{rate.toPreciseFixedDisplay()}</span>{' '}
          {showInverseRate ? route.srcToken.symbol : route.destToken.symbol}
        </motion.button>
      </RouteLabelValue>

      <RouteLabelValue
        label="Price Delta"
        tooltip={`The difference between the global index price and the estimated rate${
          isTestnet ? ' (not available for testnet assets)' : ''
        }`}
      >
        <span className={classNames('font-aeonikMono', color)}>
          {BigNumber.isBigNumber(delta) ? `${delta.toFixed(1)}%` : '-'}
        </span>
      </RouteLabelValue>

      {!isNullish(duration) && (
        <RouteLabelValue label="Total time">
          {intervalToDurationWords({ start: 0, end: duration ?? 0 })}
        </RouteLabelValue>
      )}

      {showDestinationAddress && destinationAddress && (
        <RouteLabelValue label="Destination Address">
          {abbreviate(destinationAddress)}
        </RouteLabelValue>
      )}
    </div>
  );
};
