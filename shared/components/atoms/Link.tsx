import React from 'react';
import NextLink from 'next/link';
import classNames from 'classnames';

type NextLinkProps = Parameters<typeof NextLink>[0];

export type LinkProps = {
  href: string;
  children: React.ReactNode;
  color?: 'white' | 'light' | 'orange' | 'green' | 'red' | 'blue';
  underline?: boolean;
  noPropagate?: boolean;
} & NextLinkProps;

export function Link({
  href,
  children,
  className,
  color = 'white',
  underline = false,
  noPropagate = false,
  onClick,
  ...props
}: LinkProps) {
  return (
    <NextLink
      {...props}
      href={href}
      onClick={
        onClick || noPropagate
          ? (e) => {
              if (noPropagate) e.stopPropagation();
              onClick?.(e);
            }
          : undefined
      }
      passHref
      className={classNames(
        'decoration-1 underline-offset-[2px] transition duration-300',
        color === 'white' && 'text-cf-light-3 hover:text-white',
        color === 'light' && 'text-cf-light-2 hover:text-cf-light-4',
        color === 'orange' && 'text-cf-orange-1 hover:text-cf-orange-2',
        color === 'red' && 'text-cf-red-1 hover:text-cf-red-2',
        color === 'green' && 'text-cf-green-1 hover:text-cf-green-3',
        color === 'blue' && 'text-cf-blue-2 hover:text-cf-blue-3',
        underline && 'underline',
        className,
      )}
    >
      {children}
    </NextLink>
  );
}
