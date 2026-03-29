import { formatDistanceToNow, format, isAfter, subDays } from 'date-fns';
import { vi } from 'date-fns/locale';

/**
 * Formats a date into a "time ago" string or a specific date if it's too old.
 * @param date The date to format (string or Date object)
 * @returns A formatted string
 */
export function formatTimeAgo(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  
  // If date is more than 7 days ago, show detailed date
  if (isAfter(subDays(now, 7), d)) {
    return format(d, 'HH:mm dd/MM/yyyy');
  }
  
  // Otherwise use relative time
  const distance = formatDistanceToNow(d, { addSuffix: true, locale: vi });
  
  // Custom cleanup for some common phrases in Vietnamese if needed
  return distance.replace('khoảng ', '');
}
