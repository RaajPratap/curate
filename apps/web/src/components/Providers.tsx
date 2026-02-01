'use client'

import { ReactNode } from 'react'
import { Provider } from 'react-redux'
import { store } from '@/store'
import { AuthProvider } from '@/lib/auth'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <Provider store={store}>
      <AuthProvider>{children}</AuthProvider>
    </Provider>
  )
}
