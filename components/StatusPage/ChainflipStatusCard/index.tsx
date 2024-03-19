import React, { useEffect, useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';
import * as qrCodeAnimation from '@/shared/animations/qr-code.json';
import { isEvmChain } from '@/shared/assets/chains';
import { ChainTokenLogo } from '@/shared/components';
import useTracking from '@/shared/hooks/useTracking';
import { EmojiSadIcon } from '@/shared/icons/large';
import { sleep } from '@/shared/utils';
import Lottie from '@/shared/utils/Lottie';
import SendChainflipAssets from '@/components/StatusPage/ChainflipStatusCard/SendChainflipAssets'
import SwappingArrows from '@/components/StatusPage/ChainflipStatusCard/SwappingArrows'
import SwapExecutedCheckSvg from '@/assets/svg/swap-executed-check'
import useChainflipBlockConfirmations from '@/hooks/useChainflipBlockConfirmations'
import { integrationManager, type StatusResponse } from '@/integrations'
import { type ChainflipIntegration } from '@/integrations/chainflip'
import { getDepositModeFromLocalStorage } from '@/integrations/storage'
import { SwapEvents, type SwapTrackEvents } from '@/types/track'
import { defaultAnimationProps } from '@/utils/consts'
import { UsdAmount } from '@/components/UsdAmount'

const variants = {
  hidden: {
    opacity: 0,
    y: 5,
    transition: {
      duration: 0.2,
    },
  },
  open: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.2, 0.65, 0.3, 0.9],
    },
  },
};

export default function ChainflipStatusCardContent({
  setShowDepositChannelWarning,
  status,
}: {
  setShowDepositChannelWarning: (value: boolean) => void;
  status: StatusResponse;
}) {
  const track = useTracking<SwapTrackEvents>();
  const [, setForceRender] = useState(false);
  const isCreatingDepositChannel = useRef(false);
  const [depositMode, setDepositMode] = useState<'channel' | 'contract'>(
    getDepositModeFromLocalStorage(),
  );
  const srcChainSupportsWallet = isEvmChain(status.srcToken.chain.id);
  const useDepositChannel = depositMode === 'channel' || !srcChainSupportsWallet;
  const { requiredBlockConfirmations } = useChainflipBlockConfirmations(status.srcToken.chain);

  const { mutate: openDepositChannel } = useMutation({
    mutationFn: () => {
      const chainflipIntegration = integrationManager.getIntegration(
        'chainflip',
      ) as ChainflipIntegration;
      return chainflipIntegration.createDepositChannel(status.id);
    },
    onSuccess(data) {
      track(SwapEvents.DepositChannelCreated, {
        props: {
          assetFrom: `${status.srcToken.chain.name}.${status.srcToken.symbol}`,
          assetFromAmount: status.srcAmount.toFixed(),
          assetTo: `${status.destToken.chain.name}.${status.destToken.symbol}`,
          quotedAmount: status.destAmount.toFixed(),
          destinationAddress: status.destAddress,
          depositAddress: data.depositAddress,
          expirationTime: new Date(
            (data.estimatedDepositChannelExpiryTime ?? 0) * 1000,
          ).toUTCString(),
          integration: status.integration,
        },
      });
    },
    onError(err:any) {
      toast.error('Failed to create deposit channel', {
        description: err.message,
      });
    },
  });

  useEffect(() => {
    if (status.depositAddress) {
      setDepositMode('channel');
    }
  }, [status]);

  useEffect(() => {
    if (useDepositChannel && !status.integrationData && !isCreatingDepositChannel.current) {
      // delay state change for better UX
      const openChannel = async () => {
        await sleep(1500);
        isCreatingDepositChannel.current = true;
        setForceRender(true);
        openDepositChannel();
      };
      openChannel();
    }
  }, [useDepositChannel]);

  useEffect(() => {
    if (status.status === 'waiting_for_src_tx_confirmation') {
      track(SwapEvents.ReceivingDepositAmount, {
        props: {
          assetFrom: `${status.srcToken.chain.name}.${status.srcToken.symbol}`,
          assetFromAmount: status.srcAmount.toFixed(),
          assetTo: `${status.destToken.chain.name}.${status.destToken.symbol}`,
          quotedAmount: status.destAmount.toFixed(),
          destinationAddress: status.destAddress,
          integration: status.integration,
        },
      });
    }
  }, [status.status]);

  const chainflipState = status.integration === 'chainflip' && status.integrationData?.state;
  useEffect(() => {
    if (chainflipState === 'SWAP_EXECUTED') {
      track(SwapEvents.SwapExecuted, {
        props: {
          assetFrom: `${status.srcToken.chain.name}.${status.srcToken.symbol}`,
          assetFromAmount: status.srcAmount.toFixed(),
          assetTo: `${status.destToken.chain.name}.${status.destToken.symbol}`,
          assetToAmount: status.destAmount.toFixed(),
          rate: status.destAmount.ratio(status.srcAmount).toFixed(),
          destinationAddress: status.destAddress,
          integration: status.integration,
        },
      });
    }
  }, [chainflipState]);

  if (status.integration !== 'chainflip') {
    return null;
  }

  const showSendAssetsForContractExecution =
    !useDepositChannel && !status.integrationData && status.status === 'waiting_for_src_tx';

  const showSendAssetsForDepositChannel =
    useDepositChannel && status.integrationData && status.status === 'waiting_for_src_tx';

  if (status.status === 'failed' || status.status === 'unknown' || status.status === 'refunded') {
    <div className="flex flex-col items-center justify-center space-y-1">
      <EmojiSadIcon width={60} height={60} />
      <span className="text-center text-14">Unexpected swap status</span>
    </div>;
  }

  const amountDetails = (
    <span className="text-14 text-cf-light-2">
      {status.srcAmount.toPreciseFixedDisplay()} {status.srcToken.symbol} to{' '}
      {status.destAmount.toPreciseFixedDisplay()} {status.destToken.symbol}
    </span>
  );

  return (
    <AnimatePresence mode="wait">
      {!status.integrationData && useDepositChannel && (
        <motion.div key="opening-deposit-channel" {...defaultAnimationProps}>
          <div className="relative flex flex-col items-center justify-center space-y-4 px-5 pb-6 pt-2">
            <Lottie as="div" animationData={qrCodeAnimation} autoplay loop className="h-44 w-44 z-10 relative" />
            <motion.div
              initial={false}
              animate={!isCreatingDepositChannel.current ? 'open' : 'hidden'}
              variants={variants}
              className="absolute bottom-[-2px] text-14 text-cf-light-3 "
            >
              Requesting deposit address
            </motion.div>
            <motion.div
              initial={false}
              animate={isCreatingDepositChannel.current ? 'open' : 'hidden'}
              variants={variants}
              className="absolute bottom-[-2px] text-14 text-cf-light-3 "
            >
              Opening deposit channel
            </motion.div>
          </div>
        </motion.div>
      )}
      {(showSendAssetsForDepositChannel || showSendAssetsForContractExecution) && (
        <motion.div key="send-asset" {...defaultAnimationProps}>
          <SendChainflipAssets
            status={status}
            depositMode={depositMode}
            setShowDepositChannelWarning={setShowDepositChannelWarning}
          />
        </motion.div>
      )}
      {status.status === 'waiting_for_src_tx_confirmation' && (
        <motion.div key="receiving" {...defaultAnimationProps}>
          {status.srcConfirmationCount && requiredBlockConfirmations ? (
            <div className="flex items-center justify-center px-5 py-12">
              <div className="flex flex-col text-cf-light-2">
                <span className="text-[32px] font-bold ">
                  <span className="text-cf-white">
                    {Math.min(status.srcConfirmationCount, requiredBlockConfirmations)}
                  </span>
                  /{requiredBlockConfirmations}
                </span>
                <span className="text-20 font-bold">Block Confirmations</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center px-5 py-12">
              <div className="flex flex-col text-cf-light-2">
                <span className="text-20 font-bold">Receiving</span>
                <div className="flex items-center space-x-4">
                  <div className="cf-gray-gradient flex flex-wrap justify-center gap-x-2 break-all text-[30px] font-bold">
                    {status.srcAmount.toPreciseFixedDisplay().substring(0, 16)}

                    <div className="flex items-center justify-center gap-x-2">
                      <ChainTokenLogo token={status.srcToken} />
                      {status.srcToken.symbol}
                    </div>
                  </div>
                </div>
                <span className="text-16">
                  <UsdAmount token={status.srcToken} tokenAmount={status.srcAmount} />
                </span>
              </div>
            </div>
          )}
        </motion.div>
      )}
      {status.status === 'waiting_for_dest_tx' &&
        status.integrationData?.state === 'DEPOSIT_RECEIVED' && (
          <motion.div
            data-testid="swapping"
            key="swapping"
            {...defaultAnimationProps}
            transition={{ duration: 0.2 }}
            className="flex h-[300px] items-center justify-center px-5"
          >
            <div className="mt-[-50px] flex flex-col items-center">
              <SwappingArrows />
              <div className="mt-[-30px] flex flex-col space-y-2">
                <div className="cf-gray-gradient font-aeonikBold text-20">Swapping your funds</div>
                {amountDetails}
              </div>
            </div>
          </motion.div>
        )}
      {status.status === 'waiting_for_dest_tx' &&
        status.integrationData?.state === 'SWAP_EXECUTED' && (
          <motion.div
            data-testid="swapped"
            key="swapped"
            {...defaultAnimationProps}
            className="flex h-[300px] items-center justify-center px-5"
          >
            <div className="mt-[-30px] flex flex-col items-center">
              <SwapExecutedCheckSvg />
              <div className="mt-[-20px] flex flex-col space-y-2">
                <div className="cf-gray-gradient font-aeonikBold text-20">Swap successful</div>
                {amountDetails}
              </div>
            </div>
          </motion.div>
        )}
    </AnimatePresence>
  );
}
