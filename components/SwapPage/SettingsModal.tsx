import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { CloseIcon } from '@/shared/icons/large';
import DepositModeSelector from './DepositModeSelector';

export default function SettingsModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}): JSX.Element {
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
        >
          <div className="fixed inset-0 z-20 flex w-full items-center justify-center font-aeonikRegular text-white backdrop-blur-[5px]">
            <div className="flex h-full w-full items-center justify-center md:w-[333px]">
              <Dialog.Panel className="bg-holy-radial-gray-2-30 relative w-full rounded-md border border-cf-gray-4 bg-cf-gray-1">
                <div className="flex flex-col space-y-4 p-5">
                  <div className="flex items-center">
                    <div className="cf-gray-gradient cursor-pointer font-aeonikMedium text-20">
                      Settings
                    </div>
                    <button
                      onClick={onClose}
                      type="button"
                      className="ml-auto flex h-6 w-6 items-center justify-center rounded-full text-cf-light-2 outline-none transition hover:bg-cf-gray-5 "
                    >
                      <CloseIcon className="transition hover:text-white" />
                    </button>
                  </div>
                  <div className="flex flex-col gap-y-2">
                    <div className="flex flex-col gap-y-1">
                      <span className="font-aeonikMedium text-14 text-cf-white">Deposit Mode</span>
                      <span className="text-12 text-cf-light-2">
                        Select how you want to initiate a native swap. Available only for EVM chain
                        deposits.{' '}
                        <a
                          className="underline"
                          target="_blank"
                          href="https://docs.chainflip.io/concepts/swaps-amm/deposit-channels-and-brokers"
                          rel="noreferrer"
                        >
                          Learn more
                        </a>
                      </span>
                    </div>
                    <DepositModeSelector />
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
