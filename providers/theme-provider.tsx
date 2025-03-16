'use client'

import { ThemeProvider as NextThemesProvider, ThemeProviderProps } from 'next-themes'
import { SessionProvider } from "next-auth/react"


import * as React from 'react'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <SessionProvider><NextThemesProvider {...props}>{children}</NextThemesProvider></SessionProvider>
}