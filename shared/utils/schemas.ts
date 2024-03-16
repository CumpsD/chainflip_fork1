import { z } from 'zod';
import { type ChainflipAsset, type BaseChainflipAsset } from './chainflip';

export const hexString = z
  .string()
  .refine((str): str is `0x${string}` => /^0x[0-9a-f]*$/i.test(str));
export const numberOrHex = z.union([z.number(), hexString]).transform((n) => BigInt(n));

export const ask = z
  .object({
    id: z.union([z.string(), z.number().transform((n) => String(n))]),
    tick: z.number(),
    sell_amount: numberOrHex,
    fees_earned: numberOrHex,
    original_sell_amount: numberOrHex,
  })
  .transform((order) => ({
    ...order,
    type: 'ask' as const,
  }));
export const bid = ask.transform((order) => ({
  ...order,
  type: 'bid' as const,
}));

export type RpcLimitOrder = z.infer<typeof ask> | z.infer<typeof bid>;

export type RpcRangeOrder = z.infer<typeof rangeOrder>;

export const limitOrders = z.object({
  asks: z.array(ask),
  bids: z.array(bid),
});

export const rangeOrder = z
  .object({
    id: z.union([z.string(), z.number().transform((n) => String(n))]),
    range: z.object({
      start: z.number(),
      end: z.number(),
    }),
    liquidity: numberOrHex,
    fees_earned: z.object({
      base: numberOrHex,
      quote: numberOrHex,
    }),
  })
  .transform((order) => ({
    ...order,
    type: 'range' as const,
  }));
export const rangeOrders = z.array(rangeOrder);

export type RpcOrder =
  | (z.infer<typeof ask> & { asset: BaseChainflipAsset })
  | (z.infer<typeof bid> & { asset: BaseChainflipAsset })
  | (RpcRangeOrder & { asset: BaseChainflipAsset });

export type OpenOrdersCacheResult = {
  baseAsset: BaseChainflipAsset;
  quoteAsset: Exclude<ChainflipAsset, BaseChainflipAsset>;
  orders: {
    limit_orders: {
      asks: z.infer<typeof ask>[];
      bids: z.infer<typeof bid>[];
    };
    range_orders: RpcRangeOrder[];
  };
};

export type LimitOrderType = 'Sell' | 'Buy';
