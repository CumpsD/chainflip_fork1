import { useWalletClient } from 'wagmi';
// import GreenSpinnerJSON from '@/shared/animations/spinner-green.json';
import useBoolean from '@/shared/hooks/useBoolean';
import ArrowRightIcon from '@/shared/icons/ArrowRight';
import { BridgeIcon, CloseCircleIcon } from '@/shared/icons/large';
// import Lottie from '@/shared/utils/Lottie';
import { integrationManager, type StatusResponse } from '../../../integrations';
import WalletActionButton from '../../WalletActionButton';

const SwapHighlight = ({
  status,
  isSameChainSwap,
}: {
  status: StatusResponse;
  isSameChainSwap: boolean;
}) => (
  <>
    {!isSameChainSwap && (
      <span className="font-aeonikRegular text-12 text-cf-light-2">
        Bridge from {status.route.srcToken.name} to {status.route?.destToken.name} via{' '}
        {integrationManager.getName(status.route.integration)}
        <br />
      </span>
    )}
    {isSameChainSwap && (
      <span className="font-aeonikRegular text-12 text-cf-light-2">
        Swap {status.route.srcToken.name} to {status.route?.destToken.name} via{' '}
        {integrationManager.getName(status.route.integration)}
        <br />
      </span>
    )}
    <span className="flex items-center font-aeonikRegular text-12 text-cf-light-2">
      {status.route.srcAmount.toPreciseFixedDisplay()} {status.route.srcToken.symbol}
      <ArrowRightIcon width="16" height="16" />
      {status.route.destAmount.toPreciseFixedDisplay()} {status.route.destToken.symbol}
    </span>
  </>
);

export default function ThirdPartyStatusCardContent({ status }: { status: StatusResponse }) {
  const { data: walletClient } = useWalletClient();
  const {
    value: isExecutingSwap,
    setTrue: setIsExecutingSwapTrue,
    setFalse: setIsExecutingSwapFalse,
  } = useBoolean(false);
  const { value: isSwapExecuted, setTrue: setIsSwapExecutedTrue } = useBoolean(false);

  const isSameChainSwap = status.route.srcToken.chain.id === status.route.destToken.chain.id;

  const executeSwap = async () => {
    if (!status) throw new Error('Missing swap status for executing swap');
    if (!walletClient) throw new Error('Missing wallet client for executing swap');

    setIsExecutingSwapTrue();
    try {
      const response = await integrationManager.executeSwap(
        status.integration,
        status.id,
        walletClient,
      );
      if (response.integrationData) {
        setIsSwapExecutedTrue();
      }
    } catch (err) {
      // swallow error if user canceled the transaction signing
      if ((err as { code?: string }).code !== 'ACTION_REJECTED') {
        throw err;
      }
    } finally {
      setIsExecutingSwapFalse();
    }
  };

  if (
    status.status === 'waiting_for_src_tx' ||
    status.status === 'waiting_for_src_tx_confirmation'
  ) {
    return (
      <div className="flex flex-col items-center space-y-2 pt-6">
        {!isExecutingSwap && !isSwapExecuted ? (
          <div className="flex items-center space-x-1">
            <BridgeIcon className="text-cf-green-1" />
            <span className="font-aeonikBold text-cf-light-2">Swap & Bridge</span>
          </div>
        ) : (
          // <Lottie as="span" className="h-5 w-5" animationData={GreenSpinnerJSON} autoplay loop />
          <></>
        )}

        <span className="cf-gray-gradient font-aeonikBold text-[32px] leading-9">
          {isExecutingSwap && 'Please sign the transaction'}
          {isSwapExecuted && !isSameChainSwap && 'Waiting for bridge transaction'}
          {isSwapExecuted && isSameChainSwap && 'Swap in progress'}
          {!isExecutingSwap && !isSwapExecuted && 'Start swap to continue'}
        </span>

        <SwapHighlight status={status} isSameChainSwap={isSameChainSwap} />

        {!isExecutingSwap && !isSwapExecuted && (
          <WalletActionButton
            requireConnection
            className="!mt-4"
            chainId={status.route.srcToken.chain.id}
            onClick={executeSwap}
            loading={isExecutingSwap && 'iconOnly'}
            fullWidth
          >
            Start swap
          </WalletActionButton>
        )}
      </div>
    );
  }
  if (status.status === 'waiting_for_dest_tx') {
    return (
      <div className="flex flex-col items-center space-y-2">
        {/* <Lottie as="span" className="h-5 w-5" animationData={GreenSpinnerJSON} autoplay loop /> */}
        <span className="cf-gray-gradient font-aeonikBold text-[32px] leading-9">
          Waiting for destination chain
        </span>
        <SwapHighlight status={status} isSameChainSwap={isSameChainSwap} />
      </div>
    );
  }

  if (status.status === 'failed') {
    return (
      <div className="flex flex-col items-center space-y-2 pt-12">
        <CloseCircleIcon className="text-cf-red-2" />
        <span className="cf-gray-gradient font-aeonikBold text-[32px] leading-9">
          Transaction failed
        </span>
        <span className="text-12 text-cf-light-2">Could not complete transaction</span>
        <WalletActionButton
          requireConnection
          className="!mt-10"
          chainId={status.route.srcToken.chain.id}
          onClick={() => null} // Todo: add retry logic
          loading={isExecutingSwap && 'iconOnly'}
          fullWidth
        >
          Try again
        </WalletActionButton>
      </div>
    );
  }

  return <span>{`Unknown status response (${status.status})`}</span>;
}
