import { type ClassValue, clsx } from "clsx"

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}
<<<<<<< HEAD
=======

export function formatDate(date: Date | string | number): string {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}
>>>>>>> 3597762b9e5db8060f8269f3940bef17efa0d470
