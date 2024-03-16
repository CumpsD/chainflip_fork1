import BigNumber from 'bignumber.js';
import type z from 'zod';
import { type ChainflipAsset, type BaseChainflipAsset } from './chainflip';
import { chainflipAssetMap } from './env';
import {
  type RpcRangeOrder,
  type LimitOrderType,
  type RpcOrder,
  type rangeOrders,
  type limitOrders,
  type OpenOrdersCacheResult,
} from './schemas';
import { liquidityToTokenAmounts } from './tickMath';
import TokenAmount from './TokenAmount';
import { type PoolOrderFragment, type PoolOrderStatus } from '../graphql/generated/graphql';

export const getOrderInfo = ({
  order,
  rpcOrder,
}: {
  order: PoolOrderFragment;
  rpcOrder?: RpcOrder;
}) => {
  const limitOrderType: LimitOrderType = order.baseAmount !== '0' ? 'Sell' : 'Buy';
  const baseAsset = order.baseAsset as BaseChainflipAsset;

  const baseAmount = TokenAmount.fromAsset(order.baseAmount, order.baseAsset);
  const baseCollectedFees = TokenAmount.fromAsset(order.baseCollectedFees, baseAsset);
  const quoteAmount = TokenAmount.fromAsset(order.quoteAmount, order.quoteAsset);
  const quoteCollectedFees = TokenAmount.fromAsset(order.quoteCollectedFees, order.quoteAsset);

  const orderStatus: PoolOrderStatus = rpcOrder?.id != null ? 'OPEN' : 'CLOSED';

  const fillPercentage =
    limitOrderType === 'Buy'
      ? BigNumber(order.filledQuoteAmount).div(order.quoteAmount).multipliedBy(100).toFixed(0)
      : BigNumber(order.filledBaseAmount).div(order.baseAmount).multipliedBy(100).toFixed(0);

  const rpcRangeOrder =
    order.orderType === 'RANGE' && rpcOrder ? (rpcOrder as RpcRangeOrder) : null;

  return {
    limitOrderType,
    baseAsset,
    baseAmount,
    baseCollectedFees,
    quoteAmount,
    quoteCollectedFees,
    orderStatus,
    fillPercentage,
    rpcRangeOrder,
  };
};

export const accountOrdersToLiquidityUsd = (
  orders: {
    limit_orders: z.infer<typeof limitOrders>;
    range_orders: z.infer<typeof rangeOrders>;
  },
  baseAsset: BaseChainflipAsset,
  quoteAsset: ChainflipAsset,
  baseAssetUsdPrice: number,
  quoteAssetUsdPrice: number,
  currentPoolRate: number,
) => {
  const baseToken = chainflipAssetMap[baseAsset];
  const quoteToken = chainflipAssetMap[quoteAsset];

  let usdHoldings = 0;

  for (const order of orders.range_orders) {
    const tokenAmounts = liquidityToTokenAmounts({
      liquidity: order.liquidity.toString(),
      currentRate: currentPoolRate,
      lowerTick: order.range.start,
      upperTick: order.range.end,
      baseAsset: baseAsset as BaseChainflipAsset,
    });

    usdHoldings += quoteAssetUsdPrice * tokenAmounts.quoteAsset.toNumber();
    usdHoldings += baseAssetUsdPrice * tokenAmounts.baseAsset.toNumber();
  }

  for (const order of orders.limit_orders.asks) {
    const baseTokenAmount = new TokenAmount(order.original_sell_amount, baseToken.decimals);
    usdHoldings += baseAssetUsdPrice * baseTokenAmount.toNumber();
  }

  for (const order of orders.limit_orders.bids) {
    const quoteTokenAmount = new TokenAmount(order.original_sell_amount, quoteToken.decimals);
    usdHoldings += quoteAssetUsdPrice * quoteTokenAmount.toNumber();
  }

  return usdHoldings;
};

export const transformCacheOrdersToRpcOrders = (orders: OpenOrdersCacheResult[]): RpcOrder[] =>
  orders
    .map((item) => [
      ...item.orders.limit_orders.asks.map((order) => ({
        ...order,
        asset: item.baseAsset,
        type: 'ask' as const,
      })),
      ...item.orders.limit_orders.bids.map((order) => ({
        ...order,
        asset: item.baseAsset,
        type: 'bid' as const,
      })),
      ...item.orders.range_orders.map((order) => ({
        ...order,
        asset: item.baseAsset,
        type: 'range' as const,
      })),
    ])
    .flat();
