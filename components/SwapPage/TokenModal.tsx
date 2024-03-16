import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { RadioGroup, Dialog, Transition } from '@headlessui/react';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import { MacScrollbar } from 'mac-scrollbar';
import { ViewportList } from 'react-viewport-list';
import { UserRejectedRequestError } from 'viem';
import { useWalletClient } from 'wagmi';
import { type Chain } from '@/shared/assets/chains';
import { chainLogo } from '@/shared/assets/chains/logo';
import { isWatchable, type Token } from '@/shared/assets/tokens';
import { NATIVE_TOKEN_ADDRESS } from '@/shared/assets/tokens/constants';
import { TokenLogo, Tooltip } from '@/shared/components';
import LoadingSpinner from '@/shared/components/LoadingSpinner';
import { isTestnet } from '@/shared/featureFlags';
import useTracking from '@/shared/hooks/useTracking';
import { SearchIcon, CloseIcon, ArrowIcon, EmojiSadIcon } from '@/shared/icons/large';
import { PlusIcon } from '@/shared/icons/small';
import { chainflipChainMap, type TokenAmount } from '@/shared/utils';
import { useChainBalances } from '../../hooks/useChainBalances';
import useChains from '../../hooks/useChains';
import useStore from '../../hooks/useStore';
import { useTokens } from '../../hooks/useTokens';
import { mapChainIdToChainflip } from '../../integrations/chainflip';
import { SwapEvents, type SwapTrackEvents } from '../../types/track';
import Input from '../Input';

const DisplayChain = ({ chain }: { chain: Chain }) => (
  <RadioGroup.Option value={chain}>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="hover:bg-holy-radial-gray-4-30 hover:ui-checked:bg-holy-radial-gray-5 ui-checked:bg-holy-radial-gray-5 flex cursor-pointer items-center rounded-md border border-transparent p-2 transition ease-out ui-checked:cursor-default ui-checked:border-cf-gray-5"
    >
      <div>{chainLogo[chain.id]?.({ fill: '#000', height: '24px', width: '24px' })}</div>
      <div className="ml-2 font-aeonikMedium text-14 text-cf-light-3">{chain.name}</div>
      {mapChainIdToChainflip(chain.id) && (
        <div className="ml-auto rounded-full border border-cf-blue-4/20 bg-cf-blue-4/10 px-2 py-1 font-aeonikBold text-10 text-cf-blue-4 ">
          Native
        </div>
      )}
    </motion.div>
  </RadioGroup.Option>
);

const DisplayToken = ({
  token,
  index,
  viewPortDirty,
  balance,
}: {
  token: Token;
  index: number;
  viewPortDirty: boolean;
  balance: TokenAmount | undefined;
}) => {
  const { data: client } = useWalletClient();
  const canAddToken = client != null && isWatchable(token);

  const watchToken = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!canAddToken) return;

    e.stopPropagation();

    try {
      await client.watchAsset({
        type: 'ERC20',
        options: {
          address: token.address,
          symbol: token.canonicalSymbol ?? token.symbol,
          decimals: token.decimals,
          image: token.logo,
        },
      });
    } catch (err) {
      if (!(err instanceof UserRejectedRequestError)) {
        throw err;
      }
    }
  };

  return (
    <RadioGroup.Option
      value={token}
      className="group mr-[10px] rounded-md p-2 text-14 transition hover:bg-cf-gray-4 ui-not-checked:cursor-pointer"
    >
      {({ checked }) => (
        <motion.div
          initial={viewPortDirty ? { opacity: 1, translateX: 0 } : { opacity: 0, translateX: 15 }}
          animate={{
            opacity: 1,
            translateX: 0,
          }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className="flex items-center gap-x-3 space-y-1"
        >
          <TokenLogo token={token} className="ui-checked:opacity-60" />
          <div className="flex flex-col">
            <div className="flex items-center gap-x-1">
              <div
                className={classNames(
                  'font-aeonikBold text-cf-light-3 transition ui-checked:opacity-60',
                  !checked && 'group-hover:text-cf-white',
                )}
              >
                {token.symbol}
              </div>
              {canAddToken && (
                <Tooltip content="Add token to wallet" tabable={false}>
                  <button
                    // tabbing is kind of messed up in the radio options :(
                    tabIndex={-1}
                    type="button"
                    className={classNames(
                      'flex h-4 w-4 items-center justify-center rounded-full border border-cf-gray-4',
                      'bg-cf-gray-3-5 text-cf-light-3 opacity-0 transition group-hover:opacity-100',
                      'hover:bg-cf-gray-4 hover:text-cf-white',
                    )}
                    onClick={watchToken}
                  >
                    <PlusIcon className="h-[14px] w-[14px]" />
                  </button>
                </Tooltip>
              )}
            </div>
            <div className="flex flex-row items-center space-x-1.5 ui-checked:opacity-60">
              <div className="text-cf-light-2">{token.name}</div>
              {balance?.gt(0) && (
                <div className="font-aeonikMono text-[10px] text-cf-white">
                  / {balance.toPreciseFixedDisplay()} {token.symbol}
                </div>
              )}
            </div>
          </div>
          <div
            className={classNames(
              'ml-auto translate-x-[-5px] text-cf-white opacity-0 transition',
              !checked && 'group-hover:translate-x-0 group-hover:opacity-100',
            )}
          >
            <ArrowIcon />
          </div>
          <div className="ml-auto hidden ui-checked:block ui-checked:opacity-60">Selected</div>
        </motion.div>
      )}
    </RadioGroup.Option>
  );
};

export default function TokenModal({
  isDestination,
  isOpen,
  onClose,
}: {
  isDestination: boolean;
  isOpen: boolean;
  onClose: () => void;
}): JSX.Element {
  const track = useTracking<SwapTrackEvents>();
  const sourceToken = useStore((state) => state.srcToken);
  const destToken = useStore((state) => state.destToken);
  const { chains } = useChains();
  const [chain, setChain] = useState<Chain | undefined>(chainflipChainMap.Ethereum);
  const { value: tokens, isLoading: tokensLoading } = useTokens(isOpen ? chain?.id : undefined);
  const { balances } = useChainBalances(isOpen ? chain : undefined);
  const [viewPortDirty, setViewPortDirty] = useState(false);

  const selectedToken = isDestination ? destToken : sourceToken;
  const setSrcToken = useStore((state) => state.setSrcToken);
  const setDestToken = useStore((state) => state.setDestToken);

  const setSelectedToken = isDestination ? setDestToken : setSrcToken;
  const viewportRef = useRef<HTMLDivElement | null>(null);

  const [filter, setFilter] = useState('');

  const otherToken = isDestination ? sourceToken : destToken;
  const setOtherToken = isDestination ? setSrcToken : setDestToken;

  const regex =
    filter === ''
      ? // match anything
        /./
      : // match the filtered text after escaping regex characters
        new RegExp(filter.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), 'i');

  const filteredTokens = tokens
    .filter((t) => regex.test(t.symbol) || regex.test(t.name) || regex.test(t.address))
    .sort((a, b) =>
      // display tokens with balance before tokens without balance
      balances[a.address]?.gt(0) && !balances[b.address]?.gt(0) ? -1 : 1,
    );

  const handleReopen = useCallback(() => {
    if (isOpen && selectedToken) {
      setChain(selectedToken.chain);
      setSelectedToken(selectedToken);
    }
  }, [selectedToken, isOpen]);

  useEffect(() => {
    handleReopen();
  }, [handleReopen]);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          {/* backdrop */}
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
          afterLeave={() => setFilter('')}
        >
          <div className="fixed inset-0 z-20 flex w-full items-center justify-center font-aeonikRegular text-white backdrop-blur-[5px]">
            <div className="flex h-full w-full items-center justify-center md:w-[42rem]">
              <Dialog.Panel className="bg-holy-radial-gray-2-30 relative w-full rounded-md border border-cf-gray-4 bg-cf-gray-1">
                <div className="flex h-full [&>div]:p-4">
                  <div
                    className={classNames(
                      `flex flex-col border-r border-cf-gray-4`,
                      isTestnet ? 'w-[240px]' : 'w-[200px]',
                    )}
                  >
                    <div className="cf-gray-gradient font-aeonikMedium text-[20px]">Chains</div>
                    <RadioGroup
                      data-testid="chain-radio-group"
                      by="id"
                      onChange={(c) => {
                        setChain(c);
                        setViewPortDirty(false);
                      }}
                      className="mt-4 flex flex-col space-y-1"
                      value={chain}
                    >
                      {chains.map((c) => (
                        <DisplayChain key={c.id} chain={c} />
                      ))}
                    </RadioGroup>
                  </div>
                  <div className="relative h-[700px] flex-1 flex-col space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="cf-gray-gradient font-aeonikMedium text-[20px]">Assets</div>
                      <button
                        onClick={onClose}
                        type="button"
                        className="flex h-6 w-6 items-center justify-center rounded-full text-cf-light-2 outline-none transition hover:bg-cf-gray-5 "
                      >
                        <CloseIcon className="transition hover:text-white" />
                      </button>
                    </div>
                    <div className="group relative flex flex-1">
                      <Input
                        className={classNames(
                          'peer w-full rounded-md px-4 py-2 text-14 text-cf-white transition duration-300 placeholder:pl-7',
                          // default
                          'border border-cf-gray-4 bg-cf-gray-2 placeholder:text-cf-light-1',
                          // focus
                          'focus:border-cf-gray-5 focus:bg-cf-gray-4/70 focus:placeholder:text-transparent',
                          // hover
                          'hover:border-cf-gray-5 hover:bg-cf-gray-3',
                        )}
                        onChange={(e) => setFilter(e.target.value)}
                        placeholder="Search by symbol, name, or address"
                        value={filter}
                      />
                      <div className="pointer-events-none absolute flex h-full w-12 items-center justify-center text-transparent group-focus-within:!text-transparent peer-placeholder-shown:text-cf-light-1">
                        <SearchIcon />
                      </div>
                    </div>
                    <MacScrollbar skin="dark" ref={viewportRef} className="h-full max-h-[590px]">
                      {filteredTokens.length !== 0 ? (
                        <RadioGroup
                          data-testid="token-radio-group"
                          by={(t1, t2) => t1 === t2}
                          onChange={(token) => {
                            if (isDestination) {
                              track(SwapEvents.SelectAssetTo, {
                                props: {
                                  assetFrom: `${token.chain.name}.${token.symbol}`,
                                  contractAddress: token.address,
                                  isNative: token.address === NATIVE_TOKEN_ADDRESS,
                                },
                              });
                            } else {
                              track(SwapEvents.SelectAssetFrom, {
                                props: {
                                  assetFrom: `${token.chain.name}.${token.symbol}`,
                                  contractAddress: token.address,
                                  isNative: token.address === NATIVE_TOKEN_ADDRESS,
                                },
                              });
                            }
                            setSelectedToken(token);
                            if (
                              token?.chain.id === otherToken?.chain.id &&
                              token?.address === otherToken?.address
                            ) {
                              // switch tokens when selecting token that is already selected in other field
                              setOtherToken(selectedToken);
                            }
                            onClose();
                          }}
                          value={selectedToken}
                        >
                          <ViewportList
                            viewportRef={viewportRef}
                            items={filteredTokens}
                            onViewportIndexesChange={([, b]) => {
                              if (!viewPortDirty && b > 6) {
                                setViewPortDirty(true);
                              }
                            }}
                          >
                            {(token, index) => (
                              <DisplayToken
                                key={token.chain.id + token.address}
                                token={token}
                                index={index}
                                viewPortDirty={viewPortDirty}
                                balance={balances[token.address]}
                              />
                            )}
                          </ViewportList>
                        </RadioGroup>
                      ) : (
                        <div className="flex h-full flex-col items-center justify-center text-14 text-cf-light-1">
                          {tokensLoading ? (
                            <LoadingSpinner />
                          ) : (
                            <div className="flex flex-col items-center justify-center space-y-1">
                              <EmojiSadIcon className="text-cf-light-2" width={60} height={60} />
                              <span className="px-20 text-center text-14 text-cf-light-1">
                                {filter === '' ? (
                                  <>
                                    No assets available at this time. Please try a different chain.
                                  </>
                                ) : (
                                  <>No asset found. Please try a different search.</>
                                )}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </MacScrollbar>
                  </div>
                </div>
              </Dialog.Panel>
            </div>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}
