import classNames from 'classnames';
import { Tooltip } from './molecules/Tooltip';

export default function QuestionMarkTooltip({
  content,
  disabled,
  className,
}: {
  content?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}) {
  if (!content) return null;

  return (
    <Tooltip disabled={disabled} content={content}>
      <span
        className={classNames(
          'flex h-4 w-4 items-center justify-center rounded-full bg-cf-gray-4 text-10 text-cf-light-2',
          className,
        )}
      >
        ?
      </span>
    </Tooltip>
  );
}
