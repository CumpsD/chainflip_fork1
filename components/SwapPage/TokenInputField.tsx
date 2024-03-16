import { useEffect, useState } from 'react';
import classNames from 'classnames';
import { useAccount } from 'wagmi';
import { type Token } from '@/shared/assets/tokens';
import { ChainTokenLogo, Tooltip } from '@/shared/components';
import { useTokenAmountInput, useValidatedTokenAmount } from '@/shared/hooks';
import useBoolean from '@/shared/hooks/useBoolean';
import useTracking from '@/shared/hooks/useTracking';
import { ChevronIcon as Chevron } from '@/shared/icons/large';
import { LockIcon } from '@/shared/icons/small';
import { TokenAmount } from '@/shared/utils';
import Blink from './Blink';
import TokenModal from './TokenModal';
import useChainflipSwapLimits from '../../hooks/useChainflipSwapLimits';
import useTokenBalance from '../../hooks/useTokenBalance';
import useWatchObject from '../../hooks/useWatchObject';
import { SwapEvents, type SwapTrackEvents } from '../../types/track';
import ChainTokenPlaceholder from '../ChainTokenPlaceholder';
import Input from '../Input';
import { UsdAmount } from '../UsdAmount';

type InputErrors = {
  minimumAmount: string | false;
  maximumAmount: string | false;
  requiredField: boolean;
  amountIsZero: boolean;
};

type InputWarnings = {
  insufficientBalance: boolean;
};

const InputError = ({
  errorFlags,
  warningFlags,
}: {
  errorFlags: InputErrors;
  warningFlags: InputWarnings;
}) => {
  let message: string | undefined;
  let color = 'text-cf-red-1';

  if (errorFlags.requiredField) {
    message = 'A deposit amount is required';
  } else if (errorFlags.amountIsZero) {
    message = 'Amount is too low';
  } else if (errorFlags.minimumAmount) {
    message = `Amount is below the ${errorFlags.minimumAmount} limit`;
  } else if (errorFlags.maximumAmount) {
    message = `Amount is over the ${errorFlags.maximumAmount} limit`;
  } else if (warningFlags.insufficientBalance) {
    message = 'Insufficient balance';
    color = 'text-cf-orange-1';
  }

  if (message) {
    return (
      <div
        className={classNames(
          'absolute left-0 top-full pt-1.5 text-12',
          message !== undefined && color,
        )}
      >
        {message}
      </div>
    );
  }

  return null;
};

export interface TokenInputFieldProps {
  label: string;
  token: Token | undefined;
  value: TokenAmount | undefined;
  onChange?: (newValue: TokenAmount | undefined) => void;
  readonly?: boolean;
  switchState: 'fadeIn' | 'fadeOut' | null;
  onSwitchEnd: () => void;
  setInputAmountValidator?: (cb: () => boolean) => void;
}

export default function TokenInputField({
  label,
  token,
  value,
  onChange,
  readonly = false,
  switchState,
  onSwitchEnd,
  setInputAmountValidator,
}: TokenInputFieldProps): JSX.Element {
  const track = useTracking<SwapTrackEvents>();
  const { address } = useAccount();
  const {
    value: isTokenModalOpen,
    setTrue: openTokenModal,
    setFalse: closeTokenModal,
  } = useBoolean(false);
  const {
    onChange: onInputChange,
    value: inputValue,
    setValue: setInputValue,
  } = useTokenAmountInput({
    token,
    initialValue: value?.toFixed() ?? '',
  });
  const { balance } = useTokenBalance(readonly ? undefined : token);
  const validatedAmount = useValidatedTokenAmount(inputValue, token);
  const watchedValue = useWatchObject(value, TokenAmount.areEqual);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (readonly || !inputValue) return;
    // when the token changes, write a new value to the input field
    setInputValue(TokenAmount.fromWholeUnits(inputValue, token?.decimals).toFixed());
  }, [token]);

  useEffect(() => {
    // for the destination field, we want to always write the value to the field
    if (readonly) setInputValue(value?.toFixed() ?? '');
  }, [value]);

  useEffect(() => {
    // for the source field, we want to only write the value if it is semantically different
    if (readonly || validatedAmount?.eq(watchedValue)) return;
    setInputValue(watchedValue?.toFixed() ?? '');
  }, [watchedValue]);

  useEffect(() => {
    // when the token amount semantically changes, notify the parent
    onChange?.(validatedAmount);
  }, [validatedAmount, onChange]);

  const { isLoading, maximumSwapAmount, minimumSwapAmount } = useChainflipSwapLimits(
    readonly ? undefined : token,
  );

  const showMinimumAmountWarning = Boolean(
    !isLoading &&
      minimumSwapAmount &&
      validatedAmount?.gt(0) &&
      validatedAmount?.lt(minimumSwapAmount),
  );

  const showMaximumAmountWarning = Boolean(
    !isLoading &&
      maximumSwapAmount &&
      validatedAmount &&
      validatedAmount.gt(0) &&
      validatedAmount?.gt(maximumSwapAmount),
  );

  const showInsufficientBalance = Boolean(
    token?.chain.id.startsWith('evm-') && validatedAmount && balance?.lt(validatedAmount),
  );

  const amountInvalid = !validatedAmount;
  const showFieldRequiredError = isDirty && amountInvalid;

  const amountIsZero = Boolean(!isLoading && validatedAmount?.eq(0));

  const errorFlags = {
    minimumAmount: showMinimumAmountWarning && `${minimumSwapAmount?.toFixed()} ${token?.symbol}`,
    maximumAmount: showMaximumAmountWarning && `${maximumSwapAmount?.toFixed()} ${token?.symbol}`,
    requiredField: showFieldRequiredError,
    amountIsZero,
  };

  const hasError = Object.values(errorFlags).some(Boolean);

  const warningFlags = {
    insufficientBalance: showInsufficientBalance,
  };

  const hasWarning = !hasError && Object.values(warningFlags).some(Boolean);

  setInputAmountValidator?.(() => {
    setIsDirty(true);

    return !hasError;
  });

  useEffect(() => {
    setIsDirty(inputValue !== '');
  }, [inputValue]);

  return (
    <>
      <div className="group relative flex h-[4.5rem] w-full text-cf-light-4">
        <label
          htmlFor={`${label}-field`}
          className="absolute left-2 top-[-10.5px] z-10 select-none px-[6px] text-14 text-cf-light-2"
        >
          <div className="relative flex h-full w-full items-center space-x-1">
            {readonly && (
              <Tooltip
                childrenClassName="h-full"
                content={
                  <div className="min-w-[300px]">
                    Chainflip&apos;s Just-In-Time AMM only allows exact deposit amount for now.{' '}
                    <a
                      href="https://docs.chainflip.io/concepts/swaps-amm/just-in-time-amm-protocol"
                      target="_blank"
                      rel="noreferrer"
                      className="underline"
                    >
                      Learn more
                    </a>
                  </div>
                }
              >
                <LockIcon />
              </Tooltip>
            )}
            <span>{label}</span>
          </div>
          <div
            className={classNames(
              'absolute inset-x-0 bottom-0 top-1/2 -z-10 bg-cf-gray-2',
              !readonly && 'transition duration-300 group-hover:bg-cf-gray-3',
            )}
          />
        </label>
        <div className="relative">
          {balance?.gt(0) && !balance.eq(validatedAmount) && !readonly && (
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-cf-gray-4 bg-cf-gray-2 px-1.5 py-0.5 font-aeonikMono text-[10px] uppercase opacity-0 transition hover:bg-cf-gray-3 hover:text-cf-white group-focus-within:opacity-100 group-hover:opacity-100"
              onClick={() => {
                track(SwapEvents.SelectMaxBalance, {
                  props: {
                    amount: balance.toFixed(),
                    account: address ?? 'unknown',
                  },
                });
                setInputValue(balance.toFixed());
              }}
              type="button"
            >
              Max
            </button>
          )}
          <Input
            id={`${label}-field`}
            data-testid={!readonly ? 'input-amount' : 'output-amount'}
            disabled={readonly}
            placeholder="0"
            type="text"
            inputMode="numeric"
            className={classNames(
              'peer h-full max-w-[260px] rounded-l-md border border-cf-gray-4 bg-cf-gray-2 pb-3 pl-3 font-aeonikMono text-[24px] text-white outline-none transition placeholder:text-cf-light-2 hover:bg-cf-gray-3 disabled:cursor-not-allowed disabled:hover:bg-cf-gray-2',
              hasError && 'border-cf-red-1',
              hasWarning && 'border-cf-orange-1',
              switchState === 'fadeOut' && 'text-opacity-0',
            )}
            value={inputValue}
            onChange={onInputChange}
            onBlur={() => {
              if (!readonly && validatedAmount) {
                setInputValue(validatedAmount.eq(0) ? '' : validatedAmount.toFixed());
              }
            }}
          />
        </div>

        <span
          className={classNames(
            'absolute bottom-2 pl-3 font-aeonikMono text-12 text-cf-light-2 transition peer-placeholder-shown:text-cf-gray-5',
            switchState === 'fadeOut' && 'text-opacity-0',
          )}
        >
          <UsdAmount token={token} tokenAmount={validatedAmount} />
        </span>
        <button
          type="button"
          className={classNames(
            'bg-cf-gray-2',
            'flex-1',
            'border',
            'border-l-0',
            'border-cf-gray-4',
            'rounded-r-md',
            'w-[9.5rem]',
            'h-full',
            'transition',
            'hover:bg-cf-gray-3',
          )}
          onClick={openTokenModal}
        >
          <Blink switchState={switchState} onTransitionEnd={onSwitchEnd}>
            <div
              data-testid={!readonly ? 'src-asset' : 'dest-asset'}
              className="grid items-center pl-4 pr-2 [grid-template-columns:25%_60%_15%]"
            >
              {token ? (
                <>
                  <ChainTokenLogo token={token} />
                  <div className="ml-1 flex flex-col items-start">
                    <div className="font-aeonikBold uppercase text-white">{token.symbol}</div>
                    <span className="w-full truncate text-left text-12 text-cf-light-2">
                      on {token.chain.name}
                    </span>
                  </div>
                  <Chevron className="text-cf-light-3" orientation="left-right" />
                </>
              ) : (
                <>
                  <ChainTokenPlaceholder />
                  <span className="text-14 text-cf-light-1 transition duration-300 group-hover:text-cf-light-3">
                    Select Asset
                  </span>
                </>
              )}
            </div>
          </Blink>
        </button>
        {balance?.gt(0) && (
          <button
            type="button"
            className="absolute right-0 top-full flex flex-row pt-1.5 font-aeonikMono text-[10px] text-cf-light-1"
            data-testid="balance-btn"
            onClick={() => {
              track(SwapEvents.SelectMaxBalance, {
                props: {
                  amount: balance.toFixed(),
                  account: address ?? 'unknown',
                },
              });
              setInputValue(balance.toFixed());
            }}
          >
            Balance:&nbsp;
            <span className="text-cf-white">
              {balance.toPreciseFixedDisplay()} {token?.symbol}
            </span>
          </button>
        )}
        <InputError errorFlags={errorFlags} warningFlags={warningFlags} />
      </div>
      <TokenModal isDestination={readonly} isOpen={isTokenModalOpen} onClose={closeTokenModal} />
    </>
  );
}
