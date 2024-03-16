import { useCallback, useRef, useState } from 'react';
import {
  useFloating,
  flip,
  shift,
  autoUpdate,
  type Placement,
  offset,
} from '@floating-ui/react-dom';
import { Transition } from '@headlessui/react';
import classNames from 'classnames';
import { useDocumentEventListener } from '../../hooks';
import { Key } from '../../utils/events';

export interface TooltipProps {
  content: React.ReactNode;
  children: JSX.Element;
  disabled?: boolean;
  onShow?: () => void;
  onHide?: () => void;
  childrenClassName?: string;
  pointer?: boolean;
  tabable?: boolean;
  tooltipClassName?: string;
  placement?: Placement;
}

export function Tooltip({
  content,
  children,
  disabled = false,
  onShow,
  onHide,
  childrenClassName,
  pointer = true,
  tabable = true,
  tooltipClassName,
  placement = 'top',
}: TooltipProps): JSX.Element {
  const [isActive, setIsActive] = useState(false);
  const [escHit, setEscHit] = useState(false);
  const appearTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { x, y, strategy, refs } = useFloating({
    open: isActive,
    placement,
    middleware: [offset(8), flip(), shift({ padding: 16 })],
    whileElementsMounted: autoUpdate,
  });

  const handleFocus = () => {
    if (appearTimeout.current) clearTimeout(appearTimeout.current);
    appearTimeout.current = setTimeout(() => {
      setIsActive(true);
    }, 0);
  };

  const handleBlur = () => {
    if (appearTimeout.current) clearTimeout(appearTimeout.current);
    setEscHit(false);
    setIsActive(false);
  };

  const listener = useCallback(
    (event: KeyboardEvent) => {
      if (isActive && event.key === Key.Escape) {
        setEscHit(true);
      }
    },
    [isActive],
  );
  useDocumentEventListener('keydown', listener);
  return (
    <div onPointerOver={handleFocus} onPointerEnter={handleFocus} onPointerLeave={handleBlur}>
      <div
        tabIndex={tabable ? 0 : -1}
        role="button"
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={classNames(
          !disabled && pointer ? 'cursor-pointer' : 'cursor-default',
          childrenClassName,
        )}
        aria-disabled={disabled}
        ref={refs.setReference}
      >
        {children}
      </div>

      <Transition
        appear
        show={isActive && !escHit && !disabled}
        role="tooltip"
        as="div"
        className="z-[2147483647] transition-opacity"
        enter="ease-out duration-300"
        enterFrom="opacity-0 z-20"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        beforeEnter={onShow}
        afterLeave={onHide}
        ref={refs.setFloating}
        style={{
          position: strategy,
          top: y ?? 0,
          left: x ?? 0,
        }}
      >
        <div
          className={classNames(
            'flex max-w-[400px] items-center justify-center',
            'whitespace-pre-line rounded-md border border-cf-gray-4 bg-cf-gray-3 px-3 py-2 font-aeonikRegular text-14 text-cf-light-3',
            tooltipClassName,
          )}
        >
          {content}
        </div>
      </Transition>
    </div>
  );
}
