import { useCallback } from 'react';
import { usePublicClient } from 'wagmi';

export type TxAction = 'approve' | 'funding' | 'execute-redemption';

export type SubmitTransaction = (
  action: TxAction,
  web3Call: () => Promise<`0x${string}` | null>,
) => Promise<{ success: boolean; txHash: `0x${string}` | null }>;

export function useSubmitTransaction(): SubmitTransaction {
  const publicClient = usePublicClient();

  const submitTransaction = useCallback<SubmitTransaction>(
    async (action, web3Call) => {
      let hash: `0x${string}` | null = null;

      try {
        hash = await web3Call();
      } catch (err) {
        console.log(err); //eslint-disable-line
        return { success: false, txHash: null };
      }

      if (!hash) {
        if (action === 'approve') {
          return { success: true, txHash: null };
        }
        return { success: false, txHash: null };
      }

      try {
        await publicClient.waitForTransactionReceipt({
          hash,
          confirmations: 1,
        });
      } catch {
        return { success: false, txHash: null };
      }

      return { success: true, txHash: hash };
    },
    [publicClient],
  );

  return submitTransaction;
}
