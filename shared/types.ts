export enum SharedEvents {
  ConnectWallet = 'connect_wallet',
}
export type SharedTrackEvents = {
  [SharedEvents.ConnectWallet]: {
    connectedWallet: string;
    walletProvider: string;
    path: string;
  };
};
