import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useMutation } from '@tanstack/react-query';
import classNames from 'classnames';
import { toast } from 'sonner';
import { useWalletClient } from 'wagmi';
import { isEvmChain } from '@/shared/assets/chains';
import { Button, ChainTokenLogo } from '@/shared/components';
import QuestionMarkTooltip from '@/shared/components/QuestionMarkTooltip';
import useTracking from '@/shared/hooks/useTracking';
import { EmojiSadIcon, RefreshIcon } from '@/shared/icons/large';
import { AlarmWarningIcon, QRIcon, WalletIcon } from '@/shared/icons/small';
import { formatTimeUntilExpiry } from '@/shared/utils';
import DepositAddressCard from './DepositAddressCard';
import { type ChainflipStatusResponse, integrationManager } from '../../../integrations';
import { SwapEvents, type SwapTrackEvents } from '../../../types/track';
import isChannelExpired from '../../../utils/isChannelExpired';
import WalletActionButton from '../../WalletActionButton';

function ExpiredSwapContent({ status }: { status: ChainflipStatusResponse }) {
  const router = useRouter();
  const { mutate: recreateDepositChannel } = useMutation({
    mutationFn: async () => {
      if (!status.integrationData) return;

      const preparedSwap = await integrationManager.prepareSwap(status.route);
      await router.push(`/${preparedSwap.integration}/${preparedSwap.id}`);
    },
  });

  return (
    <div className="flex min-h-[360px] items-center">
      <div className="flex w-[240px] flex-col items-center space-y-5">
        <div className="flex flex-col items-center">
          <EmojiSadIcon
            width={90}
            height={90}
            className="text-cf-light-2 drop-shadow-[0_4px_10px_rgba(255,255,255,0.15)]"
          />
          <div className="flex flex-col items-center space-y-2">
            <span className="text-20 text-white">Deposit address expired</span>
            <span className="text-14 leading-none text-cf-light-2">
              Request a new deposit address and pick up where you left off
            </span>
          </div>
        </div>
        <Button
          type="secondary-standard"
          className="flex gap-x-1"
          onClick={() => recreateDepositChannel()}
        >
          <RefreshIcon />
          Get new deposit address
        </Button>
      </div>
    </div>
  );
}

export default function SendChainflipAssets({
  status,
  depositMode,
  setShowDepositChannelWarning,
}: {
  status: ChainflipStatusResponse;
  depositMode: null | 'channel' | 'contract';
  setShowDepositChannelWarning: (value: boolean) => void;
}) {
  const track = useTracking<SwapTrackEvents>();
  const { data: walletClient } = useWalletClient();
  const srcChainSupportsWallet = isEvmChain(status.srcToken.chain.id);
  const [showQr, setShowQr] = React.useState(!srcChainSupportsWallet);
  const useDepositChannel = depositMode === 'channel' || !srcChainSupportsWallet;

  const {
    mutate: executeSwap,
    // isPending: isExecutingSwap,
    isSuccess: fundsSent,
  } = useMutation({
    mutationFn: async () => {
      if (!status) throw new Error('Missing swap status for executing swap');
      if (!walletClient) throw new Error('Missing wallet client for executing swap');

      track(SwapEvents.CtaStartSwap, {
        props: {
          assetFrom: `${status.srcToken.chain.name}.${status.srcToken.symbol}`,
          assetFromAmount: status.srcAmount.toFixed(),
          assetTo: `${status.destToken.chain.name}.${status.destToken.symbol}`,
          quotedAmount: status.destAmount.toFixed(),
          destinationAddress: status.destAddress,
          integration: status.integration,
        },
      });

      await integrationManager.executeSwap(status.integration, status.id, walletClient);
    },
    onError(err:any) {
      if ((err as { code?: string }).code !== 'ACTION_REJECTED') {
        toast.error('Failed to execute swap', { description: err.message });
      }
    },
  });

  const { isExpired, secondsUntilExpiry } = isChannelExpired({ status });

  useEffect(() => {
    setShowDepositChannelWarning(showQr && !isExpired);
  }, [showQr, isExpired]);

  const swapContent = (
    <>
      <div className="flex flex-col text-cf-light-2">
        <span className="text-white">Send</span>
        <div className="flex items-center justify-center space-x-4">
          <div className="cf-gray-gradient flex flex-wrap justify-center gap-x-2 break-all text-[30px] font-bold">
            <span>{status.srcAmount.toPreciseFixedDisplay().substring(0, 16)}</span>
            <div className="flex items-center justify-center gap-x-2">
              <ChainTokenLogo token={status.srcToken} />
              {status.srcToken.symbol}
            </div>
          </div>
        </div>
        {useDepositChannel ? (
          <span className="text-white">to the deposit address</span>
        ) : (
          <div className="mt-2 text-center text-12 text-cf-light-2">
            {status.route.steps.map((step) => (
              <div className="mt-1" key={`${step.srcToken.symbol} ${step.destToken.symbol}`}>
                Swap {step.srcAmount.toPreciseFixedDisplay()} {step.srcToken.symbol} to{' '}
                {step.destAmount.toPreciseFixedDisplay()} {step.destToken.symbol} via{' '}
                {step.protocolName}
              </div>
            ))}
          </div>
        )}
      </div>

      {secondsUntilExpiry && secondsUntilExpiry > 0 && (
        <div className="flex items-center space-x-1 text-14 text-cf-orange-2">
          <AlarmWarningIcon />
          <span>{formatTimeUntilExpiry(secondsUntilExpiry)}</span>
          <QuestionMarkTooltip content="Time left before deposit address expires" />
        </div>
      )}

      {useDepositChannel ? (
        <div className="flex w-full flex-col space-y-4">
          {showQr ? (
            <DepositAddressCard status={status} />
          ) : (
            <WalletActionButton
              requireConnection
              chainId={status.route.srcToken.chain.id}
              onClick={() => executeSwap()}
              // loading={isExecutingSwap && 'iconOnly'}
              // disabled={isExecutingSwap || fundsSent}
              fullWidth
            >
              Start swap
            </WalletActionButton>
          )}
          {srcChainSupportsWallet && (
            <button
              data-testid="show-deposit-address"
              type="button"
              className={classNames(
                `flex w-full items-center justify-center space-x-2 rounded-md border border-cf-gray-4  py-2 text-12 text-cf-light-3 outline-none`,
                'bg-cf-gray-3 hover:bg-cf-gray-4 hover:text-white',
              )}
              onClick={() => {
                const event = showQr
                  ? SwapEvents.SendFromConnectedWallet
                  : SwapEvents.ShowDepositAddress;

                track(event, {
                  props: {
                    assetFrom: `${status.srcToken.chain.name}.${status.srcToken.symbol}`,
                    assetFromAmount: status.srcAmount.toFixed(),
                    assetTo: `${status.destToken.chain.name}.${status.destToken.symbol}`,
                    quotedAmount: status.destAmount.toFixed(),
                    destinationAddress: status.destAddress,
                  },
                });

                setShowQr((prev) => !prev);
              }}
            >
              {showQr ? (
                <>
                  <WalletIcon />
                  <span>Send from my connected wallet</span>
                </>
              ) : (
                <>
                  <QRIcon />
                  <span>Show deposit address</span>
                </>
              )}
            </button>
          )}
        </div>
      ) : (
        <div className="flex w-full flex-col space-y-3">
          <WalletActionButton
            requireConnection
            chainId={status.route.srcToken.chain.id}
            onClick={() => executeSwap()}
            // loading={isExecutingSwap && 'iconOnly'}
            // disabled={isExecutingSwap || fundsSent}
            fullWidth
          >
            Start swap
          </WalletActionButton>
        </div>
      )}
    </>
  );

  return (
    <div className="flex w-full flex-col items-center space-y-3 pt-4">
      {isExpired ? <ExpiredSwapContent status={status} /> : swapContent}
    </div>
  );
}
