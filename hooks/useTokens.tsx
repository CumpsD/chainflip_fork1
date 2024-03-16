import { type ChainId } from '@/shared/assets/chains';
import { type Token } from '@/shared/assets/tokens';
import useCachedData from './useCachedData';
import { integrationManager } from '../integrations';

export const [TokensProvider, useTokens] = useCachedData<ChainId, Token[]>(
  (chainId) => integrationManager.getTokens(chainId),
  [],
);
