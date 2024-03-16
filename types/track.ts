import { type Integration } from '../integrations';

export const enum SwapEvents {
  SelectAssetFrom = 'select_asset_from',
  SelectAssetTo = 'select_asset_to',
  SelectMaxBalance = 'select_max_balance',
  SelectDestinationAddress = 'select_destination_address',
  SelectDestinationAddressError = 'select_destination_address_error',
  SelectRoute = 'select_route',
  ViewMarketData = 'view_market_data',
  CtaReviewSwap = 'cta_review_swap',
  SendFromConnectedWallet = 'send_from_connected_wallet',
  SelectDepositMode = 'select_deposit_mode',
  ShowDepositAddress = 'show_deposit_address',
  CtaStartSwap = 'cta_start_swap',
  ReceivingDepositAmount = 'receiving_deposit_amount',
  SwapExecuted = 'swap_executed',
  SendingFunds = 'sending_funds',
  SwapComplete = 'swap_complete',
  ViewSettings = 'view_settings',
  ShowLiquidityAlert = 'show_liquidity_alert',
  LiquidityAlertCancel = 'liquidity_alert_cancel',
  CtaLiquidityAlertProceed = 'cta_liquidity_alert_proceed',
  ChangeRoute = 'change_route',
  DepositChannelCreated = 'deposit_channel_created',
}
export type SwapTrackEvents = {
  [SwapEvents.SelectAssetFrom]: {
    assetFrom: string;
    contractAddress: string;
    isNative: boolean;
  };
  [SwapEvents.SelectAssetTo]: {
    assetFrom: string;
    contractAddress: string;
    isNative: boolean;
  };
  [SwapEvents.SelectMaxBalance]: { amount: string; account: string };
  [SwapEvents.SelectDestinationAddress]: { address: string };
  [SwapEvents.SelectDestinationAddressError]: { address: string };
  [SwapEvents.SelectRoute]: {
    assetFrom: string;
    assetFromAmount: string;
    assetTo: string;
    quotedAmount: string;
    estRate: string;
    // routeDetails: string;
    // priceDelta: string;
    // estGasFee: string;
    // estPlatformFee: string;
    isRecommended: boolean;
    isNative: boolean;
    integration: Integration;
  };
  [SwapEvents.ViewMarketData]: {
    assetFrom: string;
    assetTo: string;
    // routeDetails: string;
    // priceDelta: string;
  };
  [SwapEvents.CtaReviewSwap]: {
    assetFrom: string;
    assetFromAmount: string;
    assetTo: string;
    quotedAmount: string;
    estRate: string;
    // routeDetails: string;
    priceDelta: string;
    // estGasFee: string;
    // estPlatformFee: string;
    // isRecommended: boolean;
    isNative: boolean;
    integration: Integration;
  };
  [SwapEvents.SendFromConnectedWallet]: {
    assetFrom: string;
    assetFromAmount: string;
    assetTo: string;
    quotedAmount: string;
    destinationAddress: string | undefined;
  };
  [SwapEvents.ShowDepositAddress]: {
    assetFrom: string;
    assetFromAmount: string;
    assetTo: string;
    quotedAmount: string;
    destinationAddress: string | undefined;
  };
  [SwapEvents.SelectDepositMode]: {
    depositMode: string;
    isRecommended: boolean;
  };
  [SwapEvents.CtaStartSwap]: {
    assetFrom: string;
    assetFromAmount: string;
    assetTo: string;
    quotedAmount: string;
    destinationAddress: string | undefined;
    integration: Integration;
  };
  [SwapEvents.SwapExecuted]: {
    assetFrom: string;
    assetFromAmount: string;
    assetTo: string;
    assetToAmount: string;
    // quoteAssetFromAmount: string;
    // quoteAssetToAmount: string;
    // depositMode: string;
    rate: string;
    destinationAddress: string | undefined;
    integration: Integration;
  };
  [SwapEvents.SwapComplete]: {
    assetFrom: string;
    assetFromAmount: string;
    assetTo: string;
    assetToAmount: string;
    // quoteAssetFromAmount: string;
    // quoteAssetToAmount: string;
    // depositMode: string;
    rate: string;
    // priceDelta: string;
    // gasFee: string;
    // platformFee: string;
    destinationAddress: string | undefined;
    integration: Integration;
  };
  [SwapEvents.ViewSettings]: {
    assetFrom: string;
    assetTo: string;
  };
  [SwapEvents.ShowLiquidityAlert]: {
    assetFrom: string;
    assetFromAmount: string;
    assetTo: string;
    quotedAmount: string;
    // routeDetails: string;
    priceDelta: string;
    integration: Integration;
  };
  [SwapEvents.LiquidityAlertCancel]: {
    assetFrom: string;
    assetFromAmount: string;
    assetTo: string;
    quotedAmount: string;
    // routeDetails: string;
    // priceDelta: string;
    integration: Integration;
  };
  [SwapEvents.CtaLiquidityAlertProceed]: {
    assetFrom: string;
    assetFromAmount: string;
    assetTo: string;
    quotedAmount: string;
    // routeDetails: string;
    // priceDelta: string;
    integration: Integration;
  };
  [SwapEvents.ChangeRoute]: {
    assetFrom: string;
    assetFromAmount: string;
    assetTo: string;
    quotedAmount: string;
    // routeDetails: string;
    // priceDelta: string;
    currentIsRecommended: boolean;
    currentIsNative: boolean;
    integration: Integration;
  };
  [SwapEvents.DepositChannelCreated]: {
    assetFrom: string;
    assetFromAmount: string;
    assetTo: string;
    quotedAmount: string;
    destinationAddress: string | undefined;
    depositAddress: string;
    expirationTime: string;
    integration: Integration;
  };
  [SwapEvents.ReceivingDepositAmount]: {
    assetFrom: string;
    assetFromAmount: string;
    assetTo: string;
    quotedAmount: string;
    destinationAddress: string | undefined;
    // depositMode: string;
    // realDepositAmount: string;
    integration: Integration;
  };
  [SwapEvents.SendingFunds]: {
    assetFrom: string;
    assetFromAmount: string;
    assetTo: string;
    assetToAmount: string;
    // quoteAssetFromAmount: string;
    // quoteAssetToAmount: string;
    // depositMode: string;
    rate: string;
    destinationAddress: string | undefined;
    integration: Integration;
  };
};
