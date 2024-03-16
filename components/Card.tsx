import React from 'react';
import classNames from 'classnames';

const Card = React.forwardRef(
  (
    { className, children, ...props }: JSX.IntrinsicElements['div'],
    ref: React.Ref<HTMLDivElement>,
  ) =>
    React.createElement(
      'div',
      {
        ...props,
        ref,
        className: classNames('rounded-md border border-cf-gray-4', className),
      },
      children,
    ),
);

export default Card;
