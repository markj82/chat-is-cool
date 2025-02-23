import { formatRelative } from 'date-fns'

export function formatDate(date: string) {
  return formatRelative(date, new Date())
}
