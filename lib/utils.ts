import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}

export function getUrgencyColor(urgency: string): string {
  switch (urgency.toLowerCase()) {
    case 'emergency':
      return 'text-emergency-600 bg-emergency-50 border-emergency-200'
    case 'urgent':
      return 'text-orange-600 bg-orange-50 border-orange-200'
    case 'routine':
      return 'text-medical-600 bg-medical-50 border-medical-200'
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200'
  }
}

export function getUrgencyIcon(urgency: string): string {
  switch (urgency.toLowerCase()) {
    case 'emergency':
      return '🚨'
    case 'urgent':
      return '⚠️'
    case 'routine':
      return '✅'
    default:
      return 'ℹ️'
  }
}

export function calculateConfidenceColor(probability: number): string {
  if (probability >= 0.8) return 'text-green-600'
  if (probability >= 0.6) return 'text-yellow-600'
  if (probability >= 0.4) return 'text-orange-600'
  return 'text-red-600'
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validateAge(age: number): boolean {
  return age >= 0 && age <= 150
}

export function generateSessionId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}
