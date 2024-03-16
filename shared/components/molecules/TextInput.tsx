import classnames from 'classnames';

import { InputField, type InputFieldProps } from '../atoms/InputField';
import { Typography } from '../atoms/Typography';

export interface TextInputProps {
  placeholder?: string;
  label?: JSX.Element | string;
  message?: string;
  success?: boolean;
  failure?: boolean;
  onChange: InputFieldProps['onChange'];
  value?: string;
  type?: 'text' | 'number';
  startAdornment?: JSX.Element | string;
  paddingLeft?: string;
  endAdornment?: JSX.Element | string;
  endAdornmentWidth?: string;
  endAdornmentOnClick?: () => void;
  id?: string;
  disabled?: boolean;
  onKeyDown?: InputFieldProps['onKeyDown'];
}

export function TextInput({
  placeholder = '',
  label = undefined,
  message = undefined,
  success = false,
  failure = false,
  onChange,
  value,
  type = 'text',
  startAdornment,
  paddingLeft = 'pl-2.5',
  endAdornment,
  endAdornmentOnClick,
  id,
  disabled = false,
  onKeyDown,
}: TextInputProps): JSX.Element {
  return (
    <div className="w-full">
      {label && (
        <Typography variant="label-small" color={failure ? 'danger' : 'current'}>
          {label}
        </Typography>
      )}
      <div className="relative mt-2 flex">
        {startAdornment && (
          <div className="absolute left-1 top-0 flex h-full w-auto items-center p-1">
            <div className="flex w-full items-center bg-cf-gray-3">{startAdornment}</div>
          </div>
        )}
        <InputField
          onKeyDown={onKeyDown}
          type={type}
          onChange={onChange}
          value={value}
          placeholder={placeholder}
          success={success}
          failure={failure}
          paddingLeft={paddingLeft}
          id={id}
          disabled={disabled}
        />
        {endAdornment && (
          <div className="absolute right-0 top-0 flex h-full w-auto items-center p-3">
            <div
              className={classnames(
                'flex h-full w-full items-center bg-cf-gray-3',
                endAdornmentOnClick && 'cursor-pointer',
              )}
              {...(endAdornmentOnClick ? { onClick: endAdornmentOnClick } : {})}
            >
              {endAdornment}
            </div>
          </div>
        )}
      </div>
      {message && (
        <Typography
          className="mt-1.5"
          variant="label-xsmall"
          color={(failure && 'danger') || (success && 'success') || 'white'}
        >
          {message}
        </Typography>
      )}
    </div>
  );
}
