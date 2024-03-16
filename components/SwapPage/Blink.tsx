import { createElement } from 'react';
import classNames from 'classnames';

type BlinkProps = {
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  switchState: 'fadeIn' | 'fadeOut' | null;
  onTransitionEnd: () => void;
};

export default function Blink({
  children,
  className,
  as = 'div',
  switchState,
  onTransitionEnd,
}: BlinkProps): JSX.Element {
  return createElement(
    as,
    {
      className: classNames(
        className,
        'transition-opacity',
        switchState === 'fadeOut' && 'opacity-0',
      ),
      onTransitionEnd,
    },
    children,
  );
}
