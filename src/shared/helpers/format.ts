export type DateInput = Date | string | number | null | undefined

export interface FormatDateBROptions {
  dateStyle?: 'short' | 'medium' | 'long' | 'full'
  timeStyle?: 'short' | 'medium' | 'long' | 'full'
  timeZone?: string
  fallback?: string
}

/**
 * formatDateBR:
 * formats a date/time into pt-BR style using Intl API
 *
 * Example usage:
 *   formatDateBR('2025-01-01')
 *   // output: "01/01/2025"
 *
 *   formatDateBR(new Date('2025-06-15T18:00:00'), { timeStyle: 'short' })
 *   // output: "15/06/2025 15:00"  (timezone America/Sao_Paulo)
 *
 *   formatDateBR('invalid date', { fallback: '-' })
 *   // output: "-"
 */
export function formatDateBR(
  value: DateInput,
  {
    dateStyle = 'short',
    timeStyle,
    timeZone = 'America/Sao_Paulo',
    fallback = '',
  }: FormatDateBROptions = {},
): string {
  const date = parseToDate(value)
  if (!date) return fallback

  const intlOpts: Intl.DateTimeFormatOptions = { timeZone }
  if (dateStyle) intlOpts.dateStyle = dateStyle
  if (timeStyle) intlOpts.timeStyle = timeStyle

  try {
    return new Intl.DateTimeFormat('pt-BR', intlOpts).format(date)
  } catch {
    const legacyOpts: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone,
      ...(timeStyle ? { hour: '2-digit', minute: '2-digit' } : null),
    }
    return new Intl.DateTimeFormat('pt-BR', legacyOpts).format(date)
  }
}

/**
 * parseToDate:
 * normalizes any DateInput to a usable Date instance
 *
 * Example usage:
 *   parseToDate('2025-01-01')
 *   // output: Date("2025-01-01T00:00:00.000Z") (actual JS Date object)
 *
 *   parseToDate(1713133200000)
 *   // output: Date(...)
 *
 *   parseToDate('xxx invalid')
 *   // output: null
 */
export function parseToDate(value: DateInput): Date | null {
  if (value instanceof Date) return isNaN(value.getTime()) ? null : value

  if (typeof value === 'number') {
    const d = new Date(value)
    return isNaN(d.getTime()) ? null : d
  }

  if (typeof value === 'string') {
    const m = value.match(/^(\d{4})-(\d{2})-(\d{2})$/)
    if (m) {
      const [, y, mm, dd] = m
      const d = new Date(Number(y), Number(mm) - 1, Number(dd))
      return isNaN(d.getTime()) ? null : d
    }
    const d = new Date(value)
    return isNaN(d.getTime()) ? null : d
  }

  return null
}

/**
 * formatTimeBR:
 * formats only time in pt-BR without the date
 *
 * Example usage:
 *   formatTimeBR(new Date('2025-01-01T15:30:00'))
 *   // output: "12:30"  (Sao Paulo timezone)
 *
 *   formatTimeBR('2025-06-15 21:00', { timeStyle: 'medium' })
 *   // output: something like "18:00:00"
 */
export function formatTimeBR(
  value: DateInput,
  options: Omit<FormatDateBROptions, 'dateStyle'> = {},
): string {
  return formatDateBR(value, {
    ...options,
    dateStyle: undefined,
    timeStyle: options.timeStyle ?? 'short',
  })
}
