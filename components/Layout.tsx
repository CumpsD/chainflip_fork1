import classNames from 'classnames';
import { useAccount } from 'wagmi';
import { NotFound } from '@/shared/assets/token-logos';
import { MobileView } from '@/shared/components';
import useAddressScreening from '@/shared/hooks/useAddressScreening';
import { Navbar } from './Navbar';
import useSwapStatus from '../hooks/useSwapStatus';

const Layout = ({
  children,
  resourceNotFound = false,
}: {
  children?: React.ReactNode;
  resourceNotFound?: boolean;
}) => {
  const { status, isWaitingRoomStatus } = useSwapStatus();

  const isSuccess = status?.status === 'completed';
  const isFailed = status?.status === 'failed';
  const { address } = useAccount();
  const isSanctioned = useAddressScreening(address);

  if (isSanctioned) return null;

  return (
    <div className="relative flex h-full flex-col overflow-x-hidden">
      <div
        className={classNames(
          'silk-curtain transition duration-[2000ms] ease-in',
          isWaitingRoomStatus || isSuccess || isFailed ? 'saturate-[1.35]' : 'saturate-0',
          isWaitingRoomStatus || isFailed ? 'hue-rotate-180' : 'hue-rotate-0',
        )}
      />
      <Navbar />
      <div className="hidden w-full flex-1 items-center justify-center p-4 py-[136px] md:flex">
        <div className="relative z-10 w-full max-w-[1248px]">
          {resourceNotFound ? <NotFound /> : children}
        </div>
      </div>
      <MobileView />
    </div>
  );
};

export default Layout;
