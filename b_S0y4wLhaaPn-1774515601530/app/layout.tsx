import type { Metadata } from 'next'
import { Zen_Maru_Gothic } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SettingsProvider } from '@/lib/settings-context'
import './globals.css'

const zenMaruGothic = Zen_Maru_Gothic({ 
  weight: ['300', '400', '500', '700'],
  subsets: ["latin"],
  variable: '--font-zen-maru',
});

export const metadata: Metadata = {
  title: '逆算AI - 合格への最短ルート',
  description: '志望校合格から逆算した学習計画を、あなたの性格や進捗に合わせてパーソナライズ。AIが伴走する挫折しない学習管理アプリ。',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja" className={zenMaruGothic.variable}>
      <body className="font-sans antialiased">
        <SettingsProvider>
          {children}
        </SettingsProvider>
        <Analytics />
      </body>
    </html>
  )
}
