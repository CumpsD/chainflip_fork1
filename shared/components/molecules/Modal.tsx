import { type ReactNode } from 'react';
import { type TransitionEvents } from '@headlessui/react';
import { PlainModal } from './PlainModal';
import { CloseIcon } from '../../icons/large';
import { Typography } from '../atoms/Typography';
import Button from '../flip-ui-kit/Button';

export interface ModalProps {
  active: boolean;
  onCancel: () => Promise<void> | void;
  onConfirm?: () => Promise<void> | void;
  confirmLabel?: string;
  children?: ReactNode;
  heading?: string;
  headingJSX?: JSX.Element;
  subheading?: string;
  isConfirmDisabled?: boolean;
  isConfirmLoading?: boolean;
  afterLeave?: TransitionEvents['afterLeave'];
  maxHeight?: string;
  width?: number | string;
}

export function Modal({
  active,
  onConfirm,
  confirmLabel,
  onCancel,
  children,
  heading,
  headingJSX,
  subheading,
  isConfirmDisabled,
  isConfirmLoading,
  afterLeave,
  maxHeight,
  width,
}: ModalProps): JSX.Element {
  return (
    <PlainModal
      onCancel={onCancel}
      active={active}
      width={width}
      afterLeave={afterLeave}
      dialogPanelClasses="max-w-full rounded-xl border-2 border-cf-gray-4 bg-cf-gray-1 px-6 pb-6 pt-8 shadow"
    >
      <div
        className="flex flex-col"
        style={{
          maxHeight: `${maxHeight ? `${maxHeight}px` : 'none'}`,
        }}
      >
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            {heading && (
              <Typography variant="heading4" color="white">
                {heading}
              </Typography>
            )}
            {!heading && headingJSX}
            {subheading && (
              <Typography variant="label" color="white">
                {subheading}
              </Typography>
            )}
          </div>
          <button
            onClick={onCancel}
            type="button"
            className="flex h-6 w-6 items-center justify-center rounded-full text-cf-light-2 outline-none transition hover:bg-cf-gray-5"
          >
            <CloseIcon className="transition hover:text-white" />
          </button>
        </div>
        <div className="w-full space-y-4">
          <div className="py-5">{children}</div>
          {onConfirm !== undefined && (
            <Button
              onClick={onConfirm}
              disabled={isConfirmDisabled}
              fullWidth
              loading={isConfirmLoading && 'iconOnly'}
            >
              <span>{confirmLabel}</span>
            </Button>
          )}
        </div>
      </div>
    </PlainModal>
  );
}
