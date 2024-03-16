import {
  type DetailedHTMLProps,
  type ForwardedRef,
  forwardRef,
  type InputHTMLAttributes,
} from 'react';
import classNames from 'classnames';

type InputProps = DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

const Input = forwardRef(
  (
    { className, type, ...props }: InputProps = {},
    ref?: ForwardedRef<HTMLInputElement>,
  ): JSX.Element => (
    <input type={type} className={classNames('outline-none', className)} {...props} ref={ref} />
  ),
);

export default Input;
