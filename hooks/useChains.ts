import { useEffect, useState } from 'react';
import { type Chain } from '@/shared/assets/chains';
import useBoolean from '@/shared/hooks/useBoolean';
import { integrationManager } from '../integrations';
import { mapChainIdToChainflip } from '../integrations/chainflip';

interface ChainsData {
  chains: Chain[];
  isLoading: boolean;
  error: boolean;
}

const sortByChainflipChain = (a: Chain, b: Chain) =>
  mapChainIdToChainflip(a.id) && !mapChainIdToChainflip(b.id) ? -1 : 0;

const useChains = (sourceChain?: Chain): ChainsData => {
  const { value: isLoading, setTrue: onLoadingStart, setFalse: onLoadingEnd } = useBoolean(false);

  const [chains, setChains] = useState<Chain[]>([]);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    setChains([]);
    setError(false);
    onLoadingStart();

    const loadChainObservable = sourceChain
      ? integrationManager.getDestinationChains(sourceChain.id)
      : integrationManager.getChains();

    const subscription = loadChainObservable.subscribe({
      next: (_chains) => {
        setChains(_chains.sort(sortByChainflipChain));
      },
      complete: () => {
        onLoadingEnd();
      },
      error: () => {
        setError(true);
      },
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [sourceChain]);

  return {
    chains,
    isLoading,
    error, // TODO: handle error view
  };
};

export default useChains;
