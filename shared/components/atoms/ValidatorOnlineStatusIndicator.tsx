import classNames from 'classnames';
import { Tooltip } from '../molecules/Tooltip';

// https://docs.chainflip.io/concepts/validators/validator-states
export const ValidatorOnlineStatusIndicator = ({
  isOnline,
  className,
}: {
  isOnline: boolean;
  className?: string;
}) => (
  <div className={classNames('flex items-center', className)}>
    <Tooltip
      content={
        isOnline
          ? 'Validator is online.'
          : 'Validator has not submitted a heartbeat within the last interval.'
      }
    >
      <div
        className={classNames(
          'h-2 w-2 rounded-full bg-cf-green-1',
          isOnline ? 'bg-cf-green-1' : 'bg-cf-red-1',
        )}
      />
    </Tooltip>
  </div>
);
