'use client'

import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import * as React from 'react'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { config } from '../wagmi'

const queryClient = new QueryClient() 

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}> 
      <RainbowKitProvider>
        {mounted && children}
      </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
