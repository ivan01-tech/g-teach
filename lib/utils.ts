import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const formatDate = (date: number | string | Date | { nanoseconds: number, seconds: number }, locale = 'fr-FR') => {
  let d: Date | null = null;

  if (typeof date === 'string') {
    d = new Date(date);
  }
  if (typeof date === 'number') {
    d = new Date(date);
  }

  if (typeof date === 'object' && date !== null && 'seconds' in date && 'nanoseconds' in date) {
    d = new Date(date.seconds * 1000 + date.nanoseconds / 1e6);
  }

  if (!d) {
    console.log("date incorrect", date);
    return "";
  }

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(d);
};