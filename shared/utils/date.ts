import {
  differenceInSeconds,
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  intervalToDuration,
  format,
  Interval,
} from 'date-fns'
import { FLIP_SYMBOL } from '@/shared/utils/env'
import { isNullish } from './guards'
import TokenAmount from './TokenAmount'

const pluralize = (word: string, numb: number): string =>
  numb !== 1 ? `${word}s` : word

export const differenceInTimeAgo = (time: string, ago = true): string => {
  const now = Date.now()
  const timeNumber = Date.parse(time)
  const seconds = differenceInSeconds(now, timeNumber)

  if (seconds < 60) return `${seconds} sec${ago ? ' ago' : ''}`

  const minutes = differenceInMinutes(now, timeNumber)
  if (minutes < 60) return `${minutes} min${ago ? ' ago' : ''}`

  const hours = differenceInHours(now, timeNumber)
  if (hours < 48)
    return `${hours} ${pluralize('hour', hours)}${ago ? ' ago' : ''}`

  const days = differenceInDays(now, timeNumber)
  return `${days} days${ago ? ' ago' : ''}`
}

// format to number{s} or number{m} or number{h}
export const formatToApproxTime = (durationSeconds: number) => {
  if (durationSeconds < 60) {
    return `${durationSeconds}s`
  }

  if (durationSeconds < 3600) {
    return `${Math.floor(durationSeconds / 60)}m`
  }

  return `${Math.floor(durationSeconds / 3600)}h`
}

export const pad = (number: number) => String(number).padStart(2, '0')

// eg: "1h 2min 3s", "1day 2h 3min 4s"
export const intervalToDurationWords = (interval: Interval): string => {
  if (isNullish(interval.start) || isNullish(interval.end)) return '??'
  if (interval.end === 0) return '??'

  const duration = intervalToDuration(interval)

  /* eslint-disable @typescript-eslint/no-non-null-assertion */
  if (duration.months) return '>1 month'
  if (duration.days) {
    return `${pad(duration.days)}${duration.days === 1 ? 'day' : 'days'} ${pad(
      duration.hours!
    )}h ${pad(duration.minutes!)}min ${pad(duration.seconds!)}s`
  }
  if (duration.hours)
    return `${pad(duration.hours)}h ${pad(duration.minutes!)}min ${pad(
      duration.seconds!
    )}s`
  if (duration.minutes)
    return `${pad(duration.minutes)}min ${pad(duration.seconds!)}s`
  if (duration.seconds) return `${pad(duration.seconds)}s`
  return '??'
}

export const addToGoogleCalendar = (
  amount: bigint,
  startTimestamp: Date,
  endTimestamp: Date
) => {
  const flipAmount = new TokenAmount(amount).toFixed()
  const callbackUrl = process.env.NEXT_PUBLIC_REDEMPTIONS_CALENDAR_CALLBACK_URL

  const formatDateForCalendar = (date: Date) =>
    format(date, "yyyyLLdd'T'HHmmss")
  const start = formatDateForCalendar(startTimestamp)
  const end = formatDateForCalendar(endTimestamp)

  const GoogleCalenderUrl = 'https://calendar.google.com/calendar/render'

  const queryParams = {
    action: 'TEMPLATE',
    dates: `${start}/${end}`,
    text: `Redeem ${flipAmount} ${FLIP_SYMBOL}`,
    details: `Finalise redemption of ${flipAmount} ${FLIP_SYMBOL} from <a href="${callbackUrl}">${callbackUrl}</a>`,
  }

  const url = `${GoogleCalenderUrl}?${new URLSearchParams(
    queryParams
  ).toString()}`

  window.open(url, '_blank')
}

// eg: "1h 2m", "expired", "less than a minute"
export const formatTimeUntilExpiry = (duration: number) => {
  if (duration <= 0) {
    return 'Expired'
  }

  if (duration <= 60) {
    return 'less than a minute'
  }

  const hours = Math.floor(duration / 3600)
  const minutes = Math.floor((duration % 3600) / 60)

  const hoursRepresentation = hours > 0 ? `${hours}h` : ''
  const minutesRepresentation = minutes > 0 ? `${minutes}m` : ''

  return `${hoursRepresentation} ${minutesRepresentation}`
}
