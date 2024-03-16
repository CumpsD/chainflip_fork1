import { type ReactNode } from 'react';

export type ElementTypes = 'p' | 'span';

export const VariantTailwindMap = {
  display1: 'text-70 font-monumentRegular uppercase',
  display2: 'text-61 font-monumentRegular uppercase',
  display3: 'text-55 font-monumentRegular uppercase',
  display4: 'text-50 font-monumentRegular uppercase',
  display5: 'text-42 font-monumentRegular uppercase',
  heading1: 'text-35 font-aeonikMedium',
  heading2: 'text-31 font-aeonikMedium',
  heading3: 'text-28 font-aeonikMedium',
  heading4: 'text-24 font-aeonikMedium',
  heading5: 'text-20 font-aeonikMedium',
  heading6: 'text-14 font-aeonikMedium',
  pargraphlead: 'text-22 font-aeonikMedium',
  body: 'text-20 font-aeonikRegular',
  blockquote: 'text-20 font-aeonikRegular',
  helper: 'text-12 font-aeonikRegular',
  label: 'text-base font-aeonikRegular',
  'label-3xlarge': 'text-31 font-aeonikRegular',
  'label-2xlarge': 'text-28 font-aeonikRegular',
  'label-xlarge': 'text-24 font-aeonikRegular',
  'label-large': 'text-20 font-aeonikRegular',
  'label-standard-semibold': 'text-base font-aeonikMedium',
  'label-medium': 'text-16 font-aeonikRegular',
  'label-small': 'text-14 font-aeonikRegular',
  'label-small-semibold': 'text-14 font-aeonikMedium',
  'label-xsmall': 'text-10',
};

export type TypographyVariant = keyof typeof VariantTailwindMap;

export const colorMap = {
  gray: 'text-cf-light-3',
  white: 'text-white',
  black: 'text-black',
  danger: 'text-cf-red-1',
  success: 'text-alertsuccess',
  brandSuccess: 'text-cf-green-1',
  current: 'text-current',
};

export type ColorVariant = keyof typeof colorMap;

export interface TypographyProps {
  variant?: TypographyVariant;
  color?: ColorVariant;
  className?: string;
  elementType?: ElementTypes;
  children: ReactNode;
}

export function Typography({
  variant = 'body',
  color = 'gray',
  elementType = 'p',
  className,
  children,
  ...rest
}: TypographyProps): JSX.Element {
  if (elementType === 'p') {
    return (
      <p className={`${VariantTailwindMap[variant]} ${colorMap[color]} ${className}`} {...rest}>
        {children}
      </p>
    );
  }
  return (
    <span className={`${VariantTailwindMap[variant]} ${colorMap[color]} ${className}`} {...rest}>
      {children}
    </span>
  );
}
