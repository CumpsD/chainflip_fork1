import { useContractRead } from 'wagmi';
import { getChainflipNetwork } from '../utils';

/**
 * https://go.chainalysis.com/chainalysis-oracle-docs.html
 */
export default function useAddressScreening(address: string | `0x${string}` | undefined) {
  const { data: isSanctioned } = useContractRead({
    address: '0x40C57923924B5c5c5455c48D93317139ADDaC8fb',
    functionName: 'isSanctioned',
    args: [address as `0x${string}`],
    abi: [
      {
        inputs: [
          {
            internalType: 'address',
            name: 'addr',
            type: 'address',
          },
        ],
        name: 'isSanctioned',
        outputs: [
          {
            internalType: 'bool',
            name: '',
            type: 'bool',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
    ],
    chainId: 1,
    enabled:
      getChainflipNetwork() === 'mainnet' &&
      address !== undefined &&
      /^0x[a-f\d]{40}$/i.test(address),
  });

  return isSanctioned;
}
