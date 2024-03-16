import classNames from 'classnames';
import { WarningTriangleIcon as WarningTriangleIconLarge } from '@/shared/icons/large';
import { WarningTriangleIcon as WarningTriangleIconSmall } from '@/shared/icons/small';

const variants = (size: 'small' | 'large') => ({
  warning: {
    classes: ['bg-cf-orange-4', 'border-cf-orange-1/20', 'text-cf-orange-1'],
    Icon: size === 'small' ? WarningTriangleIconSmall : WarningTriangleIconLarge,
  },
});

const Callout = ({
  type,
  children,
  size = 'large',
}: {
  type: keyof ReturnType<typeof variants>;
  children: React.ReactNode;
  size?: 'small' | 'large';
}) => {
  const { classes, Icon } = variants(size)[type];

  return (
    <div className={classNames('rounded-md border p-4', ...classes)}>
      <div className="flex flex-row items-center space-x-1">
        <div>
          <Icon />
        </div>
        {children}
      </div>
    </div>
  );
};

export default Callout;
