import { z } from 'zod';
import { stringifiedTokenAmountReviver } from '@/shared/utils/TokenAmount';
import { type Integration, type RouteResponse } from './index';

export type StoredRouteResponse = RouteResponse & {
  transactionHash?: string;
  depositChannelId?: string;
};

const routeStorageKey = (integration: Integration, swapId: string) =>
  `route-${integration}-${swapId}`;

export const storeRouteInLocalStorage = (
  integration: Integration,
  swapId: string,
  route: StoredRouteResponse,
) => {
  localStorage.setItem(routeStorageKey(integration, swapId), JSON.stringify(route));

  return swapId;
};

export const loadRouteFromLocalStorage = (
  integration: Integration,
  swapId: string,
): StoredRouteResponse | undefined => {
  const stringifiedRoute = localStorage.getItem(routeStorageKey(integration, swapId));

  return stringifiedRoute
    ? (JSON.parse(stringifiedRoute, stringifiedTokenAmountReviver) as StoredRouteResponse)
    : undefined;
};

export const storeTransactionHashInLocalStorage = (
  integration: Integration,
  swapId: string,
  transactionHash: string,
) => {
  const storedRoute = loadRouteFromLocalStorage(integration, swapId);
  if (!storedRoute) throw new Error('route not found when storing transaction hash');

  storedRoute.transactionHash = transactionHash;
  storeRouteInLocalStorage(integration, swapId, storedRoute);
};

export const storeDepositChannelIdInLocalStorage = (
  integration: Integration,
  swapId: string,
  depositChannelId: string,
) => {
  const storedRoute = loadRouteFromLocalStorage(integration, swapId);
  if (!storedRoute) throw new Error('route not found when storing deposit channel id');

  storedRoute.depositChannelId = depositChannelId;
  storeRouteInLocalStorage(integration, swapId, storedRoute);
};

const depositModeSchema = z.enum(['channel', 'contract']).nullable();

export const getDepositModeFromLocalStorage = () => {
  const result = depositModeSchema.safeParse(localStorage.getItem('depositMode'));

  if (result.success) return result.data ?? 'channel';
  return 'channel';
};

export const storeDepositModeInLocalStorage = (value: 'channel' | 'contract') => {
  if (!value) {
    localStorage.removeItem('depositMode');
  } else localStorage.setItem('depositMode', value);
};
