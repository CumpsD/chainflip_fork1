export type ProgressBarVariants = 'standard' | 'active' | 'disabled' | 'warning' | 'error';
export interface ProgressBarProps {
  variant: ProgressBarVariants;
  value: number;
}

export const progressBgColors = {
  standard: 'bg-cf-gray-4',
  active: 'bg-cf-green-1',
  disabled: 'bg-cf-gray-3',
  warning: 'bg-cf-orange-1',
  error: 'bg-cf-red-1',
};

export function ProgressBar({ variant = 'standard', value = 0 }: ProgressBarProps): JSX.Element {
  const bgColor = progressBgColors[variant];

  return (
    <div className="mt-3 h-2 w-full rounded-full bg-cf-gray-3">
      <div
        style={{ width: `${value}%` }}
        className={`h-full text-center text-xs text-white ${bgColor} rounded-full`}
      />
    </div>
  );
}
