import { useEffect, useState } from 'react';
import { TokenAmount } from '@/shared/utils';
import { type Token } from '../assets/tokens';

export default function useValidatedTokenAmount(
  amount: string,
  token: Token | undefined,
): TokenAmount | undefined {
  const [tokenAmount, setTokenAmount] = useState(
    amount === '' ? undefined : TokenAmount.fromWholeUnits(amount, token?.decimals ?? 18),
  );

  useEffect(() => {
    setTokenAmount((current) => {
      if (amount === '') return undefined;
      const newAmount = TokenAmount.fromWholeUnits(amount, token?.decimals ?? 18);
      if (newAmount.isNaN() || current?.eq(newAmount)) return current;
      return newAmount;
    });
  }, [amount, token?.decimals]);

  return tokenAmount;
}
