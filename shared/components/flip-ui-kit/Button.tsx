import { forwardRef, type MouseEventHandler } from 'react';
import classNames from 'classnames';
// import * as spinnerBlack from '../../animations/spinner-black.json';
// import * as spinnerWhite from '../../animations/spinner-white.json';
import ArrowRight from '../../icons/ArrowRight';
import Lottie from '../../utils/Lottie';

type ButtonType =
  | 'primary-standard'
  | 'primary-danger'
  | 'primary-ghost'
  | 'secondary-standard'
  | 'secondary-danger'
  | 'secondary-ghost'
  | 'link-standard'
  | 'link-secondary'
  | 'link-danger';

type StyleMap = Record<ButtonType, string>;

const sizeStyles = {
  small: 'min-w-[89px] h-[32px] p-[8px] text-14',
  medium: 'min-w-[116px] h-[40px] py-[12px] px-[16px] text-14',
  large: 'min-w-[148px] h-[48px] py-[16px] px-[32px] text-16',
};

export const baseStyles: StyleMap = {
  'primary-standard': 'text-black bg-cf-green-1',
  'primary-danger': 'text-black bg-cf-red-1',
  'primary-ghost': 'text-cf-green-1 border border-cf-green-1',

  'secondary-standard': 'text-cf-light-3 bg-cf-gray-3 border border-cf-gray-4',
  'secondary-danger': 'text-cf-red-1 bg-cf-red-4 border border-cf-red-1/20',
  'secondary-ghost': 'text-cf-white border border-cf-white',

  'link-standard': 'text-cf-green-1',
  'link-secondary': 'text-cf-light-3',
  'link-danger': 'text-cf-red-1',
};

export const hoverStyles: StyleMap = {
  'primary-standard': 'hover:bg-cf-green-3',
  'primary-danger': 'hover:bg-cf-red-2',
  'primary-ghost': 'hover:text-cf-green-3 hover:border-cf-green-3',

  'secondary-standard': 'hover:text-cf-white hover:bg-cf-gray-4',
  'secondary-danger': 'hover:text-cf-red-2 border border-cf-red-1/20',
  'secondary-ghost': 'hover:text-cf-light-3 hover:border-cf-light-3',

  'link-standard': 'hover:text-cf-green-3',
  'link-secondary': 'hover:text-cf-white',
  'link-danger': 'hover:text-cf-red-2',
};

export const disabledStyles: StyleMap = {
  'primary-standard': 'disabled:text-cf-gray-5 disabled:bg-cf-gray-3-5',
  'primary-danger': 'disabled:text-cf-gray-5 disabled:bg-cf-gray-3-5',
  'primary-ghost': 'disabled:text-cf-gray-5 disabled:border disabled:border-cf-gray-5',

  'secondary-standard': 'disabled:text-cf-gray-5 disabled:bg-cf-gray-3-5',
  'secondary-danger': 'disabled:text-cf-gray-5 disabled:bg-cf-gray-3-5',
  'secondary-ghost': 'disabled:text-cf-gray-5 disabled:border disabled:border-cf-gray-5',

  'link-standard': 'disabled:text-cf-gray-5',
  'link-secondary': 'disabled:text-cf-gray-5',
  'link-danger': 'disabled:text-cf-gray-5',
};

export type ButtonProps = {
  children: React.ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: ButtonType;
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  iconPos?: 'left' | 'right';
  loading?: 'iconOnly' | boolean | undefined;
  fullWidth?: boolean;
  className?: string;
  icon?: JSX.Element;
  loadingText?: string;
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      type = 'primary-standard',
      size = 'medium',
      disabled = false,
      onClick,
      iconPos,
      loading,
      fullWidth,
      children,
      className,
      icon,
      loadingText = 'Loading...',
    },
    ref,
  ) => (
    <button
      ref={ref}
      type="button"
      disabled={disabled}
      aria-disabled={disabled}
      className={classNames(
        'flex',
        'items-center',
        'justify-center',
        'rounded-md',
        'font-aeonikMedium',
        'transition duration-300',
        sizeStyles[size],
        baseStyles[type],
        hoverStyles[type],
        disabledStyles[type],
        fullWidth && 'w-full justify-center',
        'hover:disabled:cursor-default',
        'hover:cursor-pointer',
        className,
      )}
      onClick={onClick}
    >
      {!loading && iconPos === 'left' && (
        <>
          {icon || <ArrowRight className={classNames(size === 'small' ? 'mr-[4px]' : 'mr-[8x]')} />}
          {children}
        </>
      )}
      {!loading && iconPos === 'right' && (
        <>
          {children}
          {icon || <ArrowRight className={classNames(size === 'small' ? 'ml-[4px]' : 'ml-[8x]')} />}
        </>
      )}
      {loading && (
        <>
          {/* <Lottie
            as="div"
            animationData={
              type.includes('ghost') || disabled || type.includes('secondary')
                ? spinnerWhite
                : spinnerBlack
            }
            autoplay
            loop
            className="h-[18px] w-[18px]"
          /> */}
          {loading !== 'iconOnly' && (
            <span className={classNames('ml-2', size === 'large' ? 'text-16' : 'text-14')}>
              {loadingText}
            </span>
          )}
        </>
      )}
      {!iconPos && !loading && children}
    </button>
  ),
);

export default Button;
