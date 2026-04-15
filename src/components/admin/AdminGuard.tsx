'use client'

import { Loader2 } from 'lucide-react'

interface AdminGuardProps {
  children: React.ReactNode
}

export default function AdminGuard({ children }: AdminGuardProps) {
  return (
    <>
      {/* Middleware handles auth, this is just loading state */}
      {children}
    </>
  )
}

