import { useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { chainTransparentLogo } from '@/shared/assets/chains/logo';
import { Link, WarningModal } from '@/shared/components';
import useBoolean from '@/shared/hooks/useBoolean';
import useTracking from '@/shared/hooks/useTracking';
import { SettingsIcon } from '@/shared/icons/large';
import { WalletIcon } from '@/shared/icons/small';
import { getChainflipNetwork } from '@/shared/utils';
import DestinationAddressInput from './DestinationAddressInput';
import SettingsModal from './SettingsModal';
import TokenFields from './TokenFields';
import useFormValidation from '../../hooks/useFormValidation';
import usePriceDelta from '../../hooks/usePriceDelta';
import useStore from '../../hooks/useStore';
import { integrationManager } from '../../integrations';
import { SwapEvents, type SwapTrackEvents } from '../../types/track';
import WalletActionButton from '../WalletActionButton';

type WarningType = 'existentialDeposit' | 'lowLiquidity';
const warnings = {
  existentialDeposit: {
    title: 'DOT amount is below minimum',
    content: (
      <>
        If your destination address DOT balance is below the{' '}
        <Link
          href="https://support.polkadot.network/support/solutions/articles/65000168651-what-is-the-existential-deposit"
          target="_blank"
          underline
        >
          Existential Deposit
        </Link>
        , your funds will be lost.
      </>
    ),
  },
  lowLiquidity: {
    title: 'Liquidity is low',
    content: (
      <>
        We&apos;re experiencing problems getting Liquidity Provider quotes and can&apos;t guarantee
        good pricing at this time.
      </>
    ),
  },
};

export default function SwapCard(): JSX.Element {
  const router = useRouter();
  const track = useTracking<SwapTrackEvents>();
  const srcToken = useStore((state) => state.srcToken);
  const destToken = useStore((state) => state.destToken);
  const selectedRoute = useStore((state) => state.selectedRoute);
  const { setValidator, validateForm } = useFormValidation({
    srcAmount: () => false,
    destinationAddress: () => false,
    destAmount: () => false,
  });

  const {
    value: showSettingsModal,
    setTrue: openSettingsModal,
    setFalse: closeSettingsModal,
  } = useBoolean(false);
  const {
    value: showWarningModal,
    setTrue: openWarningModal,
    setFalse: closeWarningModal,
  } = useBoolean(false);
  const [warning, setWarning] = useState<WarningType>();
  const warningAccepted = useRef<Partial<Record<WarningType, boolean>>>({});

  const { delta, isLowLiquidity } = usePriceDelta({
    srcAmount: selectedRoute?.srcAmount,
    destAmount: selectedRoute?.destAmount,
    srcAsset: selectedRoute?.srcToken,
    destAsset: selectedRoute?.destToken,
  });

  const { mutate: prepareSwap, isPending: isPreparingSwap } = useMutation({
    mutationFn: async () => {
      if (!validateForm()) return;

      const showExistentialDepositWarning =
        (destToken?.chain.id === 'dot' || destToken?.chain.id === 'dot-testnet') &&
        selectedRoute?.destAmount?.lt(1.1e10);

      if (showExistentialDepositWarning && !warningAccepted.current.existentialDeposit) {
        setWarning('existentialDeposit');
        openWarningModal();
        return;
      }

      if (
        isLowLiquidity &&
        getChainflipNetwork() !== 'perseverance' &&
        !warningAccepted.current.lowLiquidity
      ) {
        if (selectedRoute) {
          track(SwapEvents.ShowLiquidityAlert, {
            props: {
              assetFrom: `${selectedRoute.srcToken.chain.name}.${selectedRoute.srcToken.symbol}`,
              assetFromAmount: selectedRoute.srcAmount.toFixed(),
              assetTo: `${selectedRoute.destToken.chain.name}.${selectedRoute.destToken.symbol}`,
              quotedAmount: selectedRoute.destAmount.toFixed(),
              priceDelta: delta.toFixed(),
              integration: selectedRoute.integration,
            },
          });
        }

        setWarning('lowLiquidity');
        openWarningModal();
        return;
      }

      if (!selectedRoute) {
        toast.error('No routes available, please try selecting a different pair of assets.');
        return;
      }
      track(SwapEvents.CtaReviewSwap, {
        props: {
          assetFrom: `${selectedRoute.srcToken.chain.name}.${selectedRoute.srcToken.symbol}`,
          assetFromAmount: selectedRoute.srcAmount.toFixed(),
          assetTo: `${selectedRoute.destToken.chain.name}.${selectedRoute.destToken.symbol}`,
          quotedAmount: selectedRoute.destAmount.toFixed(),
          estRate: selectedRoute.destAmount.ratio(selectedRoute.srcAmount).toFixed(),
          priceDelta: delta?.toFixed() ?? '-',
          isNative: selectedRoute.integration === 'chainflip',
          integration: selectedRoute.integration,
        },
      });

      const preparedSwap = await integrationManager.prepareSwap(selectedRoute);
      await router.push(`/${preparedSwap.integration}/${preparedSwap.id}`);
    },
  });

  return (
    <>
      <div className="flex h-full flex-col items-center">
        <div className="bg-holy-radial-gray-2-60 flex w-[488px] flex-col space-y-8 rounded-md border border-cf-gray-4 p-4 backdrop-blur-[6px]">
          <div className="flex items-center">
            <div className="cf-gray-gradient font-aeonikMedium text-[20px]">Swap</div>
            <button
              type="button"
              className="ml-auto rounded-md border border-cf-gray-4 bg-cf-gray-3 p-1 transition hover:bg-cf-gray-4"
              onClick={() => {
                track(SwapEvents.ViewSettings, {
                  props: {
                    assetFrom: srcToken ? `${srcToken.chain.name}.${srcToken.symbol}` : '-',
                    assetTo: destToken ? `${destToken.chain.name}.${destToken.symbol}` : '-',
                  },
                });
                openSettingsModal();
              }}
            >
              <SettingsIcon className="text-cf-green-1" />
            </button>
          </div>
          <TokenFields
            setSrcInputAmountValidator={(cb) => {
              setValidator('srcAmount', cb);
            }}
            setDestInputAmountValidator={(cb) => {
              setValidator('destAmount', cb);
            }}
          />
          <div className="w-full space-y-4">
            <div className="flex items-center text-16 text-cf-light-2">
              <div className="flex items-center space-x-2">
                <WalletIcon className="text-cf-green-1" />
                <span className="text-14">Destination Address</span>
              </div>
              {destToken && (
                <div className="ml-auto flex items-center space-x-1 rounded-full border border-cf-gray-5 bg-cf-gray-4 px-2 py-1 text-12 text-white">
                  {chainTransparentLogo[destToken.chain.id]?.({
                    width: '14',
                    height: '14',
                  })}
                  <span>{destToken.chain.name} Network</span>
                </div>
              )}
            </div>
            <DestinationAddressInput
              token={destToken}
              setValidator={(cb) => {
                setValidator('destinationAddress', cb);
              }}
            />
          </div>
          <div className="z-10 flex items-center space-x-4">
            <WalletActionButton
              requireConnection={Boolean(
                selectedRoute && selectedRoute.integration !== 'chainflip',
              )}
              chainId={selectedRoute?.srcToken.chain.id}
              disabled={isPreparingSwap}
              onClick={() => prepareSwap()}
            >
              Review swap
            </WalletActionButton>
          </div>
        </div>
      </div>
      <SettingsModal isOpen={showSettingsModal} onClose={closeSettingsModal} />
      {warning && (
        <WarningModal
          isOpen={showWarningModal}
          onAccept={() => {
            if (warning === 'lowLiquidity' && selectedRoute) {
              track(SwapEvents.CtaLiquidityAlertProceed, {
                props: {
                  assetFrom: `${selectedRoute.srcToken.chain.name}.${selectedRoute.srcToken.symbol}`,
                  assetFromAmount: selectedRoute.srcAmount.toFixed(),
                  assetTo: `${selectedRoute.destToken.chain.name}.${selectedRoute.destToken.symbol}`,
                  quotedAmount: selectedRoute.destAmount.toFixed(),
                  integration: selectedRoute.integration,
                },
              });
            }

            warningAccepted.current[warning] = true;
            closeWarningModal();
            prepareSwap();
          }}
          onClose={() => {
            if (warning === 'lowLiquidity' && selectedRoute) {
              track(SwapEvents.LiquidityAlertCancel, {
                props: {
                  assetFrom: `${selectedRoute.srcToken.chain.name}.${selectedRoute.srcToken.symbol}`,
                  assetFromAmount: selectedRoute.srcAmount.toFixed(),
                  assetTo: `${selectedRoute.destToken.chain.name}.${selectedRoute.destToken.symbol}`,
                  quotedAmount: selectedRoute.destAmount.toFixed(),
                  integration: selectedRoute.integration,
                },
              });
            }

            closeWarningModal();
          }}
          title={warnings[warning].title}
          content={warnings[warning].content}
        />
      )}
    </>
  );
}
