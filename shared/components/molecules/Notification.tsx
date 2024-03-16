import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CloseIcon } from '../../assets/icons/Close';

export enum NotificationTypes {
  DepositReceived = 'depositReceived',
  CopyToClipboard = 'copyToClipboard',
  ConfirmationsCompleted = 'confirmationsCompleted',
  BatchingCompleted = 'batchingCompleted',
  PayoutSent = 'payoutSent',
  TransactionPending = 'transactionPending',
  ClipboardFailed = 'clipboardFailed',
  Error = 'error',
}

export interface NotificationAttributes {
  id: string;
  type?: NotificationTypes;
  description?: string;
  title?: string;
  timestamp: number;
  fromAddress?: string;
  toAddress?: string;
  amount?: string;
  token?: string;
  redirectTo?: string;
}
type NotificationProps = {
  icon: JSX.Element | undefined;
  title: JSX.Element | string;
  description: JSX.Element | string;
  footer: JSX.Element | string;
  fromNotificationCenter?: boolean;
  onClose?: () => void;
};

// px overflow to right of the screen - used in closing animation
const exitAnimationPx = '40px';

export default function Notification({
  icon,
  title,
  description,
  footer,
  fromNotificationCenter,
  onClose,
}: NotificationProps): JSX.Element {
  // animation states

  const [x, setX] = useState('-20px');
  const [opacity, setOpacity] = useState(1);
  const [fromNotifCenter, setFromNotifCenter] = useState(fromNotificationCenter ?? false);
  const closeNotification = useCallback(() => {
    if (fromNotifCenter) setFromNotifCenter(!fromNotifCenter); // revert flag to activate animation settings in the html
    setOpacity(0); // set opacity as 0 to fade out
    setTimeout(() => {
      // delay sliding on X back to exit a bit longer than fade out
      setX(exitAnimationPx);
    }, 50);
    setTimeout(() => {
      if (onClose) onClose();
    }, 600);
  }, [fromNotifCenter, onClose]);

  // used to reverse the animation flow back to exit
  useEffect(() => {
    // Dont reverse animation automatically if notification is fromNotifCenter
    if (fromNotifCenter) return;
    // trigger once only & that's when a notification should slide back to exit
    const timer = setTimeout(() => {
      // timer to force animation to return after x seconds
      closeNotification();
    }, 4000);

    // eslint-disable-next-line
    return () => {
      clearTimeout(timer);
    };
  }, [fromNotifCenter, closeNotification]);

  return (
    <motion.div
      className="z-10 mt-4 flex w-[378px] items-start justify-between rounded-md border-[0.5px] border-cf-gray-4 bg-cf-gray-3 p-4"
      initial={!fromNotifCenter && { x: exitAnimationPx, opacity: 0 }}
      animate={
        !fromNotifCenter && {
          x,
          opacity,
        }
      }
      transition={{
        type: 'spring',
        damping: 15,
        stiffness: 100,
        restDelta: 0.001,
        mass: 1,
      }}
    >
      <div className="mr-8 flex items-start justify-start">
        <div>{icon}</div>
        <div className="ml-4 flex-col items-start justify-start">
          <p className="font-aeonikBold text-14 text-white">{title}</p>
          <p className="break-all text-14 text-cf-light-2">{description}</p>
          <p className="mt-2 text-12  text-cf-light-2">{footer}</p>
        </div>
      </div>
      <button type="button" onClick={closeNotification}>
        <CloseIcon />
      </button>
    </motion.div>
  );
}
