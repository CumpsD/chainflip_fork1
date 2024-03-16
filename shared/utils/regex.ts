// positive decimals only, dont allow two leading zeros or multiple "."
export const POSITIVE_DECIMALS_REGEX = /(^(?!00)\d+([.]\d*)?$)|(^$)/;

export const decimalRegex = (decimals = 18): RegExp =>
  new RegExp(String.raw`^$|^(?!00)\d+(\.\d{0,${decimals}}$|$)`);

export const PERIOD_WITH_TRAILING_ZEROS = /\.0*$/;
export const ALL_ZEROS = /^0+$/;
export const LEADING_ZEROS = /^0+(?=[1-9])/;
export const TRAILING_ZEROS = /(\d+\.[1-9]+)0*$/;
