const network = process.env.NEXT_PUBLIC_CHAINFLIP_NETWORK;
export const isTestnet = network !== 'mainnet';
