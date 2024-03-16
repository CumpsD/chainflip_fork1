import { type ChangeEvent, useCallback, useState } from 'react';
import BigNumber from 'bignumber.js';
import { type Token } from '../assets/tokens';
import { decimalRegex } from '../utils/regex';

function validateInputChange(value: string, token: Token | undefined): string | null {
  const newValue = value.replace(',', '.');
  if (newValue === '.') {
    return '0.';
  }

  if (/^0\d/.test(newValue)) {
    return newValue.slice(1);
  }

  if (!decimalRegex(token?.decimals).test(newValue)) return null;

  return newValue;
}

function useTokenAmountInput({
  token,
  initialValue,
}: {
  token?: Token | undefined;
  initialValue?: string;
}) {
  const [value, _setValue] = useState(initialValue ?? '');

  const onInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const newValue = validateInputChange(event.target.value, token);
      if (newValue != null) {
        _setValue(newValue);
      }
    },
    [token, value],
  );

  const setValue = useCallback(
    (newValue: BigNumber.Value) => {
      if (newValue === '') {
        _setValue('');
        return;
      }

      const nearestValidAmount = token
        ? BigNumber(newValue).decimalPlaces(token.decimals)
        : BigNumber(newValue);

      // use BigNumber.toFixed() to prevent using scientific notation (1.5e30) for big values
      _setValue(nearestValidAmount.toFixed());
    },
    [_setValue, token],
  );

  return { onChange: onInputChange, value, setValue };
}

export default useTokenAmountInput;
