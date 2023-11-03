import { EthereumProvider } from '../components/Context'

export const metadata = {
  title: 'zkSync + ethers v5 + Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <EthereumProvider>
          {children}
        </EthereumProvider>
      </body>
    </html>
  )
}
