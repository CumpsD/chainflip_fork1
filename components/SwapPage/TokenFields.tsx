import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { toCamelCase, TokenAmount } from '@/shared/utils';
import { type ChainflipAsset } from '@/shared/utils/chainflip';
import { chainflipAssetMap } from '@/shared/utils/env';
import Lottie from '@/shared/utils/Lottie';
import TokenInputField from './TokenInputField';
import switchJSON from '@/shared/assets/lotties/switch.json'
import useStore from '../../hooks/useStore';

export default function TokenFields({
  setSrcInputAmountValidator,
  setDestInputAmountValidator,
}: {
  setSrcInputAmountValidator: (cb: () => boolean) => void;
  setDestInputAmountValidator: (cb: () => boolean) => void;
}) {
  const router = useRouter();
  const srcToken = useStore((state) => state.srcToken);
  const srcAmount = useStore((state) => state.srcAmount);
  const destToken = useStore((state) => state.destToken);
  const destAmount = useStore((state) => state.selectedRoute?.destAmount);
  const setSrcToken = useStore((state) => state.setSrcToken);
  const setSrcAmount = useStore((state) => state.setSrcAmount);
  const setDestToken = useStore((state) => state.setDestToken);

  const [switchState, setSwitchState] = useState<'fadeIn' | 'fadeOut' | null>(null);

  useEffect(() => {
    // eslint-disable-next-line prefer-const
    let { srcAsset, destAsset, ...remainingQuery } = router.query;
    srcAsset = srcAsset && toCamelCase(srcAsset as string);
    destAsset = destAsset && toCamelCase(destAsset as string);

    if (typeof srcAsset === 'string' && srcAsset in chainflipAssetMap) {
      setSrcToken(chainflipAssetMap[srcAsset as ChainflipAsset]);
    }
    if (typeof destAsset === 'string' && destAsset in chainflipAssetMap) {
      setDestToken(chainflipAssetMap[destAsset as ChainflipAsset]);
    }

    // remove asset params from url after they are set to the state
    if (srcAsset || destAsset) {
      router.replace({ pathname: router.pathname, query: remainingQuery });
    }
  }, [router.query.srcAsset, router.query.destAsset]);

  const onTokenSwitch = useCallback(() => {
    if (switchState === 'fadeIn') {
      if (destAmount?.gt(0)) {
        setSrcAmount(new TokenAmount(destAmount?.value ?? 0, destToken?.decimals));
      }
      setSrcToken(destToken);
      setDestToken(srcToken);
    }
  }, [srcToken, destToken, switchState, destAmount]);

  useEffect(onTokenSwitch, [switchState]);

  const onSwitchEnd = useCallback(() => {
    if (switchState === 'fadeOut') {
      setSwitchState('fadeIn');
    } else if (switchState === 'fadeIn') {
      setSwitchState(null);
    }
  }, [switchState]);

  return (
    <div className="flex w-full flex-col items-center space-y-4">
      <TokenInputField
        label="Deposit"
        token={srcToken}
        value={srcAmount}
        onChange={(amount) => {
          setSrcAmount(amount);
        }}
        switchState={switchState}
        onSwitchEnd={onSwitchEnd}
        setInputAmountValidator={setSrcInputAmountValidator}
      />
      <div
        className="rounded-md border border-cf-gray-4 bg-cf-gray-2 px-1.5 pt-1.5"
        onClick={(e) => {
          if (switchState !== null) {
            e.preventDefault();
          } else {
            setSwitchState('fadeOut');
          }
        }}
      >
        <Lottie
          as="button"
          animationData={switchJSON}
          autoplay={false}
          loop={false}
          className="h-[22px] w-[22px] rotate-90 stroke-white"
        /> 
      </div>
      <TokenInputField
        label="Receive"
        token={destToken}
        value={srcAmount && destAmount}
        readonly
        switchState={switchState}
        onSwitchEnd={onSwitchEnd}
        setInputAmountValidator={setDestInputAmountValidator}
      />
    </div>
  );
}
