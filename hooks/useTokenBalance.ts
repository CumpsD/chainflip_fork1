import { type Token } from '@/shared/assets/tokens';
import { type TokenAmount } from '@/shared/utils';
import { useChainBalances } from './useChainBalances';

interface BalanceData {
  balance: TokenAmount | undefined;
  isLoading: boolean;
}

const useTokenBalance = (token: Token | undefined): BalanceData => {
  // instead of fetching balances separately, we batch requests and cache results in the useChainBalances hook
  // this allows us to drastically reduce the number of requests when displaying a list of tokens
  const { isLoading, balances: chainBalances } = useChainBalances(token?.chain);

  if (!token) return { balance: undefined, isLoading: false };

  return {
    balance: token ? chainBalances[token.address] : undefined,
    isLoading,
  };
};

export default useTokenBalance;
