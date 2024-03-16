import type { DetailedHTMLProps, InputHTMLAttributes } from 'react';
import classnames from 'classnames';

type UsedInputProps =
  | 'type'
  | 'className'
  | 'onChange'
  | 'onKeyUp'
  | 'onKeyPress'
  | 'onKeyDown'
  | 'value'
  | 'placeholder'
  | 'id'
  | 'disabled';

type InputProps = DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

export interface InputFieldProps extends Pick<InputProps, UsedInputProps> {
  onEnterAction?: () => void;
  success?: boolean;
  failure?: boolean;
  type?: 'text' | 'number';
  paddingLeft?: string;
  background?: string;
  borderColor?: string;
  onFocus?: () => void;
  onBlur?: () => void;
}

export function InputField({
  placeholder = '',
  success = false,
  failure = false,
  disabled = false,
  onChange,
  onKeyPress,
  onKeyDown,
  onEnterAction,
  value,
  type = 'text',
  paddingLeft = 'pl-2.5',
  background = 'bg-cf-gray-3',
  borderColor = 'border border-cf-gray-4',
  id,
  className = '',
  onFocus,
  onBlur,
}: InputFieldProps): JSX.Element {
  const basicStyles = `
  rounded-xl
  text-cf-light-3
  ${borderColor}
  flex-1
  appearance-none
  w-full
  py-2
  ${paddingLeft}
  pr-2.5
  ${background}
  placeholder-cf-light-1
  shadow-sm
  focus:text-cf-light-3
  focus:outline-none
  focus:border-transparent
  h-12
  `;
  const successStyles = `border-alertsuccess`;
  const failureStyles = `border-cf-red-1`;
  const disabledStyles = `text-cf-gray-4 pointer-events-none`;
  const onEnter = (event: React.KeyboardEvent<Element>) => {
    if (event.key === 'Enter' && onEnterAction) {
      onEnterAction();
    }
  };

  return (
    <input
      type={type}
      className={classnames(
        basicStyles,
        success && successStyles,
        failure && failureStyles,
        disabled && disabledStyles,
        className,
      )}
      onChange={onChange}
      onKeyUp={onEnter}
      onKeyPress={onKeyPress}
      onKeyDown={onKeyDown}
      value={value}
      placeholder={placeholder}
      id={id}
      onBlur={onBlur}
      onFocus={onFocus}
    />
  );
}
