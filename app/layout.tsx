import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Ayla - From Silhouette to Stitch',
  description: 'AI-Powered Indian Women Styling & Tailoring Assistant. From Silhouette to Stitch, Designed on You.',
  manifest: '/manifest.json',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#f97316',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className={`${inter.className} bg-gray-50`}>
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">A</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Ayla</h1>
                  <p className="text-xs text-gray-500 italic">From Silhouette to Stitch</p>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        <div className="min-h-screen">
          {children}
        </div>
        
        <footer className="bg-white border-t border-gray-200 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <p className="text-sm text-gray-600">
                © 2026 Ayla. Empowering personal style through AI.
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Made with ❤️ for the modern Indian wardrobe
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}