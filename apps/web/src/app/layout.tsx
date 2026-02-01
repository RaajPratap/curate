import type { Metadata } from 'next'
import { Providers } from '@/components/Providers'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'CURATE | Sustainable Streetwear',
  description: 'Conscious fashion for the next generation. Sustainable streetwear that doesn\'t compromise on style.',
  keywords: ['streetwear', 'sustainable fashion', 'eco-friendly', 'conscious clothing'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-foreground noise">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
