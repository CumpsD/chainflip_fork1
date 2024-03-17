import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Button } from '@/shared/components';
import WarningHero from '../assets/svg/modal-warning';

export const WarningModal = ({
  isOpen,
  onAccept,
  onClose,
  title,
  content,
}: {
  isOpen: boolean;
  onAccept: () => void;
  onClose: () => void;
  title: string;
  content: JSX.Element;
}): JSX.Element => (
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
        <div className="fixed inset-0 z-[100] flex w-full items-center justify-center font-aeonikRegular text-white backdrop-blur-[5px]">
          <div className="flex h-full w-full items-center justify-center md:w-[30rem]">
            <Dialog.Panel className="bg-holy-radial-gray-2-30 relative flex w-full flex-col rounded-md border border-cf-gray-4 bg-cf-gray-1 p-5">
              <WarningHero className="pointer-events-none absolute right-0 top-0" />
              <div className="pb-12">
                <div className="cf-gray-gradient font-aeonikMedium text-20">{title}</div>
                <div className="max-w-[80%] pt-2 text-14 text-cf-light-2">{content}</div>
              </div>
              <div className="flex gap-x-2 self-end">
                <Button type="secondary-standard" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="secondary-danger" onClick={() => onAccept()}>
                  Proceed anyways
                </Button>
              </div>
            </Dialog.Panel>
          </div>
        </div>
      </Transition.Child>
    </Dialog>
  </Transition>
);
