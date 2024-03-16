import classnames from 'classnames';

import { ProgressBar } from '../atoms/ProgressBar';
import { Typography } from '../atoms/Typography';

export type ProgressVariants = 'standard' | 'active' | 'disabled' | 'warning' | 'error';
export interface ProgressProps {
  value: number;
  variant?: ProgressVariants;
  label?: string;
  showPercent?: boolean;
}

export function Progress({
  variant = 'standard',
  value = 0,
  label,
  showPercent = true,
}: ProgressProps): JSX.Element {
  return (
    <div className="flex w-80 flex-col">
      <ProgressBar value={value} variant={variant} />
      <div className={classnames('mt-2 flex', showPercent && 'justify-between')}>
        <Typography variant="label">{label}</Typography>
        {showPercent && <Typography variant="label">{value}%</Typography>}
      </div>
    </div>
  );
}
