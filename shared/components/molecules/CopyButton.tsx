import classNames from 'classnames';
// import grayCopyAnimationData from '@/shared/animations/copy-gray.json';
// import copyAnimationData from '@/shared/animations/copy.json';
import Lottie from '@/shared/utils/Lottie';
import { copy } from '../../utils/helpers';

interface CopyButtonProps {
  textToCopy: string;
  gray?: boolean;
  className?: string;
  displayText?: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({
  textToCopy,
  gray = false,
  className = 'h-[24px] w-[24px]',
  displayText,
  ...props
}): JSX.Element => {
  const handleClick = (event: React.SyntheticEvent) => {
    event.stopPropagation();
    (event.currentTarget.childNodes[0] as HTMLElement).click();
  };

  const lottie = (
    // <Lottie
    //   as="button"
    //   className={classNames(className, 'min-w-[24px]')}
    //   animationData={gray ? grayCopyAnimationData : copyAnimationData}
    //   autoplay={false}
    //   speed={1}
    //   loop={false}
    //   onClick={(e) => {
    //     e.stopPropagation();
    //     copy(textToCopy);
    //   }}
    //   playOnce
    //   {...props}
    // />
    <></>
  );

  return displayText ? (
    <div
      className="flex cursor-pointer items-center rounded-md border border-cf-gray-4 bg-cf-gray-3 px-2 py-1 text-12 text-cf-light-2 transition duration-300 hover:bg-cf-gray-4"
      onClick={handleClick}
    >
      {lottie}
      <span className="whitespace-nowrap">{displayText}</span>
    </div>
  ) : (
    lottie
  );
};
export default CopyButton;
