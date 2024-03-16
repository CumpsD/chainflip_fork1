import { useCallback, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { useAccount } from 'wagmi';
import { validateChainAddress } from '@/shared/assets/chains/addressValidation';
import { type Token } from '@/shared/assets/tokens';
import useTracking from '@/shared/hooks/useTracking';
import useStore, { selectDestinationAddressValid } from '../../hooks/useStore';
import { SwapEvents, type SwapTrackEvents } from '../../types/track';

type DestinationAddressInputProps = {
  token: Token | undefined;
  setValidator: (validator: () => boolean) => void;
};

export default function DestinationAddressInput({
  token,
  setValidator,
}: DestinationAddressInputProps): JSX.Element {
  const track = useTracking<SwapTrackEvents>();
  const destinationAddress = useStore((state) => state.destinationAddress);
  const destinationAddressIsValid = useStore(selectDestinationAddressValid);
  const destinationChain = useStore((state) => state.destToken?.chain.id);
  const previousChain = useRef(destinationChain);
  const setDestinationAddress = useStore((state) => state.setDestinationAddress);

  const [isDirty, setIsDirty] = useState(false);
  const { address } = useAccount();

  setValidator(() => {
    setIsDirty(true);
    return destinationAddressIsValid;
  });

  useEffect(() => {
    if (address && destinationChain) {
      if (validateChainAddress(address)[destinationChain]) {
        if (!isDirty) setDestinationAddress(address);
      } else {
        setDestinationAddress('');
      }
    }
  }, [destinationChain, setDestinationAddress, address]);

  useEffect(() => {
    setIsDirty(false);
    if (destinationChain === previousChain.current) return;

    if (!destinationChain || !validateChainAddress(destinationAddress)[destinationChain]) {
      setDestinationAddress('');
    }
  }, [destinationChain]);

  useEffect(() => {
    if (destinationAddress === '') setIsDirty(false);
  }, [destinationAddress]);

  const onChange: React.ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
    setIsDirty(true);
    const newValue = e.target.value;
    track(SwapEvents.SelectDestinationAddress, {
      props: { address: newValue },
    });
    if (/^[0-9a-z]*$/i.test(newValue)) {
      setDestinationAddress(newValue);
    }
  }, []);

  const showError = isDirty && !destinationAddressIsValid;
  if (showError) {
    track(SwapEvents.SelectDestinationAddressError, {
      props: { address: destinationAddress },
    });
  }

  return (
    <div className="relative">
      <input
        data-testid="destination-address"
        className={classNames(
          'peer w-full break-all border-b bg-transparent pb-2 font-aeonikMono outline-none transition-[border-color] placeholder:text-cf-light-1 focus:placeholder:text-transparent',
          showError
            ? 'border-cf-red-1 hover:border-cf-red-1 focus:border-cf-red-1'
            : 'border-cf-gray-5 hover:border-cf-light-1 focus:border-cf-light-2',
          destinationAddress === '' &&
            'text-cf-gray-5 caret-cf-light-4 before:cursor-text before:content-[attr(data-placeholder)]',
        )}
        placeholder="Enter your address here"
        onChange={onChange}
        spellCheck={false}
        value={destinationAddress}
      />
      <span
        className={classNames(
          'absolute -bottom-5 left-0 text-12 text-cf-red-1/75 transition-all peer-hover:text-cf-red-1/90 peer-focus:text-cf-red-1',
          !showError && 'opacity-0',
        )}
      >
        A valid {token?.chain.name} address is required
      </span>
    </div>
  );
}
