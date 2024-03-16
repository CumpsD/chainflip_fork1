import classNames from 'classnames';
import Computer from '../assets/svg/computer.svg';

type SizeThreshold = 'small' | 'medium' | 'large';

const getHideClass = (size: SizeThreshold) => {
  if (size === 'small') return 'sm:hidden';
  if (size === 'medium') return 'md:hidden';
  if (size === 'large') return 'lg:hidden';

  return '';
};
const MobileView = ({
  screenSizeThreshold,
}: {
  screenSizeThreshold?: 'small' | 'medium' | 'large';
}) => {
  const hideClasses = getHideClass(screenSizeThreshold || 'medium');

  return (
    <div
      className={classNames(
        'my-auto flex h-full w-full flex-col items-center justify-center',
        hideClasses,
      )}
    >
      <Computer />
      <div className="flex flex-col items-center">
        <div className="cf-gray-gradient text-20 font-bold text-white">
          Only available on Desktop
        </div>
        <div className="text-14 text-cf-light-2">Mobile version coming soon</div>
      </div>
    </div>
  );
};

export default MobileView;
