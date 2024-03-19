import { decodeAddress } from '@polkadot/util-crypto'
import { etherscanUrl } from './helpers'

type CamelCase<T extends string> = T extends `${infer F}${infer R}`
  ? `${Capitalize<F>}${Lowercase<R>}`
  : T

export const isHash = (string: string | undefined): string is `0x${string}` =>
  string?.startsWith('0x') ?? false

export const capitalize = (text: string): string =>
  text.charAt(0).toUpperCase() + text.slice(1)

export const toNumber = (string: string): number | typeof NaN =>
  parseInt(string, 10)

export const isInteger = (string: string): boolean => /^\d+$/.test(string)

export const ethTxLink = (hash: string): string =>
  `${etherscanUrl()}/tx/${hash}`

export const abbreviate = (
  text: string | undefined | null,
  showLength = 4,
  space = false
): string => {
  if (typeof text !== 'string') return ''
  const leftPart = text.slice(0, showLength)
  const rightPart = text.slice(text.length - showLength)

  return [leftPart, rightPart].join(space ? ' . . . ' : '…')
}

// Convenience method to truncate long strings for display purposes.
export const truncateString = (
  string: string,
  numCharacters = 20,
  ellipsis = true
): string => {
  if (string.length < numCharacters) return string

  let slicedString = string.slice(0, numCharacters)
  if (ellipsis) {
    slicedString += '...'
  }
  return slicedString
}

export const isValidValidatorHex = (text: string): boolean => {
  if (text) {
    return text.slice(0, 2) === '0x' && text.length === 66
  }
  return false
}

export const ss58ToHex = (existingKey: string): `0x${string}` => {
  const bytes = decodeAddress(existingKey)
  return `0x${[...bytes].map((b) => b.toString(16).padStart(2, '0')).join('')}`
}

// common links
export const links = {
  website: 'https://chainflip.io',
  discord: 'https://discord.gg/chainflip-community',
  twitter: 'https://twitter.com/chainflip',
  telegram: 'https://t.me/chainflip',
  blog: 'https://blog.chainflip.io/',
  docs: 'https://docs.chainflip.io/',
}

export const formatIpfsUrl = (stringURI: string) =>
  stringURI.startsWith('ipfs')
    ? `https://ipfs.io/ipfs/${stringURI.slice(7)}`
    : stringURI

export const toCamelCase = <T extends string>(str: T): CamelCase<T> =>
  `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}` as CamelCase<T>

export const toUpperCase = <T extends string>(str: T): Uppercase<T> =>
  str.toUpperCase() as Uppercase<T>

export const toLowerCase = <T extends string>(str: T): Lowercase<T> =>
  str.toLowerCase() as Lowercase<T>

export const hexToUtf8 = (hex: string | undefined): string => {
  if (!hex) return ''
  const bytes = decodeAddress(hex)
  return new TextDecoder().decode(bytes)
}
