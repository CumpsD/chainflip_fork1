import { Fragment, type ReactNode } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import classNames from 'classnames';

export const PlainModal = ({
  active,
  onCancel,
  afterLeave,
  width,
  children,
  dialogPanelClasses,
}: {
  active: boolean;
  onCancel: () => void;
  afterLeave?: () => void;
  width?: number | string;
  children?: ReactNode;
  dialogPanelClasses?: string;
}) => (
  <Transition appear show={active} as={Fragment}>
    <Dialog onClose={onCancel} as="div" className="fixed inset-0 z-50 overflow-y-auto">
      {/* transparent background */}
      <Transition.Child
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 bg-black/60 backdrop-blur-[5px]" onClick={onCancel} />
      </Transition.Child>

      <div
        className="flex h-full flex-col items-center justify-center z-10 relative"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-headline"
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
          afterLeave={afterLeave}
        >
          {/* Modal body */}
          <Dialog.Panel
            as="div"
            className={classNames('max-w-full overflow-y-auto shadow', dialogPanelClasses)}
            style={{ width: width ?? '640px' }}
          >
            {children}
          </Dialog.Panel>
        </Transition.Child>
      </div>
    </Dialog>
  </Transition>
);
