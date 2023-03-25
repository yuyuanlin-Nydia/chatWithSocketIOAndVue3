import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)
dayjs.extend(utc)
dayjs.extend(timezone)

export function dayjsTz (value?: string): dayjs.Dayjs {
  return dayjs(value).tz('Asia/Taipei')
}

export function sortString (value1: string, value2: string): string[] {
  return [value1, value2].sort((a, b) => a.localeCompare(b))
}
