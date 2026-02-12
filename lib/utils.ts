import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const formatDate = (date: number | string | Date, locale = 'fr-FR') => {
  let d: Date = new Date();
  if (typeof date === 'string') {
    d = new Date(date);
  }
  if (typeof date === 'number') {
    d = new Date(date);
  }

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(d);
};