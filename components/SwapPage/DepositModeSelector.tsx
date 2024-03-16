import { useState } from 'react';
import classNames from 'classnames';
import useTracking from '@/shared/hooks/useTracking';
import { ContractCallIcon, QRIcon } from '@/shared/icons/large';
import {
  BoltIcon,
  CheckCircleIcon,
  ClockIcon,
  GasIcon,
  ShuffleIcon,
  WalletIcon,
} from '@/shared/icons/small';
import Bolt from './Bolt';
import {
  getDepositModeFromLocalStorage,
  storeDepositModeInLocalStorage,
} from '../../integrations/storage';
import { SwapEvents, type SwapTrackEvents } from '../../types/track';
import RadioButton from '../RadioButton';

const IconText = ({
  icon,
  text,
  className,
}: {
  icon: JSX.Element;
  text: string;
  className?: string;
}) => (
  <div className={classNames('relative flex w-[55px] flex-col items-center space-y-2', className)}>
    <Bolt className="absolute top-[-1px]" />
    <div className="rounded-full border border-cf-gray-4 bg-cf-gray-2 p-1">{icon}</div>
    <span className="relative text-center text-12 text-cf-light-2">{text}</span>
  </div>
);

const DepositModeSelector = () => {
  const track = useTracking<SwapTrackEvents>();
  const [selected, setSelected] = useState(getDepositModeFromLocalStorage());

  const onCardClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const value = event.currentTarget.id as 'channel' | 'contract';

    storeDepositModeInLocalStorage(value);

    track(SwapEvents.SelectDepositMode, {
      props: {
        depositMode: value,
        isRecommended: value === 'channel',
      },
    });

    setSelected(value);
  };

  return (
    <div className="flex flex-col gap-y-2">
      <button
        id="channel"
        type="button"
        className={classNames(
          `flex cursor-pointer flex-col space-y-2 rounded-md border border-cf-gray-4 bg-red-100 p-5 transition ease-in`,
          selected === 'channel'
            ? 'bg-route-card-selected border-cf-light-1/50'
            : 'bg-deposit-mode-card hover:bg-deposit-mode-card-hover',
        )}
        onClick={onCardClick}
      >
        <div className="flex w-full items-center space-x-1">
          <QRIcon />
          <span className="font-aeonikMedium text-14 text-white">Deposit Address</span>
          <div className="rounded-full border border-cf-green-1/20 bg-cf-green-4 px-1 text-10 text-cf-green-1">
            Recommended
          </div>
          <div className="relative !ml-auto">
            <RadioButton selected={selected === 'channel'} />
          </div>
        </div>
        <div className="flex w-full">
          <IconText icon={<WalletIcon />} text="No wallet required" className="ml-0.5" />
          <IconText
            icon={<ShuffleIcon />}
            text="Simple asset transfer"
            className="ml-[34px] w-[69px]"
          />
          <IconText icon={<ClockIcon />} text="Reserved for 24hs" className="ml-[23px]" />
        </div>
      </button>
      <button
        id="contract"
        type="button"
        className={classNames(
          `flex cursor-pointer flex-col space-y-4 rounded-md border border-cf-gray-4 bg-red-100 p-5 transition ease-in`,
          selected === 'contract'
            ? 'bg-route-card-selected'
            : 'bg-deposit-mode-card hover:bg-deposit-mode-card-hover',
        )}
        onClick={onCardClick}
      >
        <div className="flex w-full items-center space-x-1">
          <ContractCallIcon />
          <span className="font-aeonikMedium text-14 text-white">Vault Smart Contract</span>
          <div className="relative !ml-auto">
            <RadioButton selected={selected === 'contract'} />
          </div>
        </div>
        <div className="flex w-full items-center justify-between">
          <IconText icon={<BoltIcon />} text="Direct call. No Broker" />
          <IconText icon={<GasIcon />} text="Needs token approval" className="ml-[23px] w-[82px]" />
          <IconText
            icon={<CheckCircleIcon />}
            text="Only supported wallets"
            className="ml-1 w-[83px]"
          />
        </div>
      </button>
    </div>
  );
};

export default DepositModeSelector;
