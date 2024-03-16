import { Tooltip } from './Tooltip';
import { differenceInTimeAgo } from '../../utils';

export default function AgeWithTooltip({ timestamp }: { timestamp: string }) {
  return (
    <Tooltip content={new Date(timestamp).toLocaleString()} pointer={false}>
      <div>{differenceInTimeAgo(new Date(timestamp).toUTCString())}</div>
    </Tooltip>
  );
}
