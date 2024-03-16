import { SkeletonLine } from '../atoms/LoadingSkeleton';
import QuestionMarkTooltip from '../QuestionMarkTooltip';

const Card = ({
  icon,
  children,
  title,
  loading,
  tooltip,
  footer,
}: {
  icon: JSX.Element;
  children: React.ReactNode;
  title: string;
  loading: boolean;
  tooltip?: string;
  footer?: string;
}) => (
  <div className="flex-1 rounded-lg border border-cf-gray-3-5 bg-cf-gray-2 p-4">
    <div className="flex items-center space-x-2">
      {icon}
      <span>{title}</span>
      <QuestionMarkTooltip content={tooltip} />
    </div>
    <div className="mt-3 text-24 text-cf-light-4">{loading ? <SkeletonLine /> : children}</div>
    {footer && <div className="mt-1 text-16 text-cf-light-2">{footer}</div>}
  </div>
);

export default Card;
