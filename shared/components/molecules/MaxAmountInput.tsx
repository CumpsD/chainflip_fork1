import { FLIP_SYMBOL, type TokenAmount } from '../../utils';
import { POSITIVE_DECIMALS_REGEX } from '../../utils/regex';
import { InputField, type InputFieldProps } from '../atoms/InputField';
import { Typography } from '../atoms/Typography';

export interface MaxAmountInputProps {
  label: string;
  value: string;
  placeholder: string;
  message?: string;
  success?: boolean;
  failure?: boolean;
  maxAmount?: TokenAmount;
  maxAmountLabel?: string;
  maxAmountCurrency?: string;
  setAmountValue: (_amount: string) => void;
  onKeyDown?: InputFieldProps['onKeyDown'];
}

const MaxAmountInput = ({
  placeholder = '',
  label = '',
  message = '',
  setAmountValue,
  value,
  success = false,
  failure = false,
  maxAmount,
  maxAmountLabel = 'Available Balance',
  maxAmountCurrency = FLIP_SYMBOL,
  onKeyDown,
}: MaxAmountInputProps) => {
  const onChangeWrapper: InputFieldProps['onChange'] = (event) => {
    if (POSITIVE_DECIMALS_REGEX.test(event.target.value)) {
      setAmountValue(event.target.value);
    }
    event.preventDefault();
  };

  return (
    <div className="w-full">
      {label && (
        <div className="flex items-center">
          <Typography variant="label-small" color={failure ? 'danger' : 'current'}>
            {label}
          </Typography>
          {maxAmount && (
            <div className="ml-auto flex flex-col items-center text-xs sm:flex-row">
              <span className="font-extralight">{maxAmountLabel}:</span>
              <span className="ml-1">
                {maxAmount.toFixed()} {maxAmountCurrency}
              </span>
            </div>
          )}
        </div>
      )}
      <div className="relative mt-2 rounded-md shadow-sm">
        <InputField
          type="text"
          placeholder={placeholder}
          value={value}
          success={success}
          failure={failure}
          onChange={onChangeWrapper}
          onKeyDown={onKeyDown}
        />
        {maxAmount && (
          <div
            onClick={() => {
              setAmountValue(maxAmount.toFixed());
            }}
            className="absolute inset-y-0 right-3 flex items-center"
          >
            <div className="cursor-pointer rounded bg-cf-gray-4 px-3 py-1 text-sm">Max</div>
          </div>
        )}
      </div>
      {message && (
        <Typography
          className="mt-1.5"
          variant="label-xsmall"
          color={(failure && 'danger') || (success && 'success') || 'gray'}
        >
          {message}
        </Typography>
      )}
    </div>
  );
};

export default MaxAmountInput;
