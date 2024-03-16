import classNames from 'classnames';
import DiscordIcon from '../../icons/Discord';
import TelegramIcon from '../../icons/Telegram';

const roundButtonStyles = `rounded-full inline-block font-semibold inline-flex justify-center items-center`;
const squareButtonStyles = `rounded-md inline-block font-semibold inline-flex justify-center items-center`;
const squareRoundedButtonStyles = `rounded-xl inline-block font-semibold `;

export const buttonSizeStyles = {
  sm: 'py-2 px-4',
  md: 'py-3 px-8',
};

export const buttonBaseStyles = {
  primary: `bg-cf-green-1 text-black text-sm`,
  secondary: ' bg-transparent text-cf-white border border-cf-white text-sm',
  tertiary: 'bg-transparent text-cf-white text-sm',
  discord: 'bg-[#5865F2] text-white text-sm',
  telegram: 'bg-[#0088CC] text-white text-sm',
  input: 'bg-cf-gray-4 text-white text-sm border-none',
  branded: `bg-glowing-button-transparent bg-[length:102%] bg-center border border-cf-white text-cf-white text-sm`,
  'branded-solid':
    'bg-glowing-button bg-[length:102%] bg-center border border-white/20 text-cf-white text-sm',
};

export const buttonHoverStyles = {
  primary: 'hover:bg-cf-green-2 transition',
  secondary: 'hover:border-cf-green-1 hover:text-cf-green-1 transition',
  tertiary: 'hover:text-cf-light-1',
  discord: 'hover:shadow-sm hover:shadow-discord',
  telegram: 'hover:shadow-sm hover:shadow-telegram',
  input: '',
  branded:
    'hover:bg-glowing-button hover:border-white/20 hover:bg-clip-border hover:text-white transition duration-500 hover:filter hover:shadow-brandgradient',
  'branded-solid':
    'hover:bg-glowing-button hover:border-white/20 hover:bg-clip-border hover:text-white transition duration-500 hover:filter hover:shadow-brandgradient',
};

export const buttonDisabledStyles = {
  primary: 'bg-transparent border-solid border border-cf-gray-4 text-cf-gray-4',
  secondary: 'bg-cf-gray-2 text-cf-gray-4',
  tertiary: 'text-cf-gray-4',
  discord: '',
  telegram: '',
  input: '',
  branded: '',
  'branded-solid': '',
};

export type ButtonVariants = keyof typeof buttonBaseStyles;
type Size = keyof typeof buttonSizeStyles;

export type ButtonProps =
  | {
      disabled?: boolean;
      onClick: () => void;
      children?: JSX.Element[] | JSX.Element | string;
      variant: ButtonVariants;
      type?: 'round' | 'square' | 'square-rounded';
      size?: Size;
      fullwidth?: boolean;
      icon?: JSX.Element;
      className?: string;
    }
  | {
      disabled?: boolean;
      onClick?: () => void;
      children?: JSX.Element[] | JSX.Element | string;
      variant: ButtonVariants;
      type?: 'round' | 'square' | 'square-rounded';
      size?: Size;
      fullwidth?: boolean;
      icon?: JSX.Element;
      className?: string;
      link: true;
    };

export function Button({
  variant = 'primary',
  type = 'round',
  size = 'md',
  disabled = false,
  icon,
  fullwidth = false,
  onClick,
  children,
  className,
}: ButtonProps): JSX.Element {
  const sizeStyles = buttonSizeStyles[size];
  const baseStyles = buttonBaseStyles[variant];
  const hoverStyles = buttonHoverStyles[variant];
  const disabledStyles = `${buttonDisabledStyles[variant]} cursor-default`;

  return (
    <div
      className={classNames(
        className, // Comes first, overrides.
        sizeStyles,
        type === 'round' && `${roundButtonStyles}`,
        type === 'square' && `${squareButtonStyles}`,
        type === 'square-rounded' && `${squareRoundedButtonStyles}`,
        !disabled && `${baseStyles} ${hoverStyles}`,
        disabled && `${disabledStyles}`,
        'group',
        fullwidth && 'w-full',
      )}
      onClick={!disabled ? onClick : undefined}
      onKeyPress={!disabled ? onClick : undefined}
      role="button"
      tabIndex={0}
    >
      <span className="flex items-center">
        {variant === 'discord' && <DiscordIcon className="mr-2" />}
        {variant === 'telegram' && <TelegramIcon className="mr-2" />}
        {icon && <div className="mr-2">{icon}</div>}
        {children}
      </span>
    </div>
  );
}
