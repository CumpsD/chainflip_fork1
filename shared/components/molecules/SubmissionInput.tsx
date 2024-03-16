import { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Tooltip } from './Tooltip';
import useBoolean from '../../hooks/useBoolean';
import { ArrowIcon } from '../../icons/large';
import { InputField } from '../atoms/InputField';
import LoadingSpinner from '../LoadingSpinner';

type Validation = { message: string; type: 'error' | 'success' };

const basicStyles = classNames(
  'pl-3',
  'border-spacing-1',
  'rounded-md',
  'text-cf-light-2',
  'border-cf-gray-4',
  'bg-cf-gray-2',
  'flex',
  'justify-start',
  'items-center',
  'border',
  'hover:border-cf-gray-5',
  'hover:ease-out duration-300',
  'focus-within:bg-cf-gray-3',
  'focus-within:border-cf-gray-5',
  'focus-within:text-white',
);

type SubmissionInputProps = {
  fullWidth?: boolean;
  onSubmit: (content: string) => Promise<void> | void;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  icon?: JSX.Element;
  disabled?: boolean;
  validation: Validation | null;
  className?: string;
};

const SubmissionInput = ({
  onSubmit,
  placeholder,
  icon,
  onChange,
  validation,
  disabled,
  className,
  fullWidth = false,
}: SubmissionInputProps) => {
  const [value, setValue] = useState('');
  const [showValidation, setShowValidation] = useState(Boolean(validation));
  const hasError = validation?.type === 'error';

  useEffect(() => {
    setShowValidation(Boolean(validation));
  }, [validation]);

  const { setTrue: hideIcon, setFalse: unhideIcon, value: shouldHideIcon } = useBoolean(false);

  return (
    <div className="w-full text-[14px]">
      <Tooltip
        content={validation?.message}
        disabled={!showValidation}
        tooltipClassName="max-w-full"
        placement="bottom-start"
      >
        <div
          className={classNames(
            className,
            basicStyles,
            hasError &&
              'border-cf-red-1 hover:border-cf-red-1 focus:border-cf-gray-5 focus:bg-cf-gray-3 focus:text-white',
            !hasError && 'border-cf-gray-4',
            fullWidth && 'w-full',
            fullWidth && 'max-w-none',
          )}
        >
          {!shouldHideIcon && icon}
          <InputField
            className={classNames(
              'pointer-events-auto h-[44px] border-none bg-none',
              hasError && 'border-cf-red-1',
            )}
            placeholder={placeholder}
            background="bg-transparent"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              onChange?.(e);
            }}
            onEnterAction={() => {
              onSubmit(value);
            }}
            onFocus={hideIcon}
            onBlur={unhideIcon}
          />
          <button
            className="flex h-[44px] w-12 items-center justify-center rounded-r-md bg-cf-gray-4 duration-300 ease-out hover:text-white"
            type="submit"
            onClick={() => {
              onSubmit(value);
            }}
            disabled={disabled}
          >
            {disabled ? (
              <LoadingSpinner />
            ) : (
              <ArrowIcon className="text-cf-light-2 duration-300 hover:text-white hover:ease-out" />
            )}
          </button>
        </div>
      </Tooltip>
    </div>
  );
};

export default SubmissionInput;
