import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDistanceToNow(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) return "A l'instant"
  if (diffInSeconds < 3600) return `Il y a ${Math.floor(diffInSeconds / 60)} min`
  if (diffInSeconds < 86400) return `Il y a ${Math.floor(diffInSeconds / 3600)} h`
  if (diffInSeconds < 604800) return `Il y a ${Math.floor(diffInSeconds / 86400)} j`
  if (diffInSeconds < 2592000) return `Il y a ${Math.floor(diffInSeconds / 604800)} sem`
  return `Il y a ${Math.floor(diffInSeconds / 2592000)} mois`
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-MA', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount) + ' DH'
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('fr-MA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase()
}
