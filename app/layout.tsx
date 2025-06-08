import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "سوق اليمن الدولي",
  description: "منصة تسوق إلكتروني شاملة للمجتمع اليمني",
  generator: "v0.dev",
  manifest: "/manifest.json",
  other: {
    "pi-network-app-id": "yemen-international-market",
    "pi-network-app-name": "سوق اليمن الدولي",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        {/* Pi Network Meta Tags */}
        <meta name="pi-network-app-id" content="yemen-international-market" />
        <meta name="pi-network-app-name" content="سوق اليمن الدولي" />
        <meta name="pi-network-callback-url" content="/payment-callback" />

        {/* Deep Link Support */}
        <link rel="alternate" href="pi://app/yemen-market" />

        {/* PWA Support */}
        <meta name="theme-color" content="#dc2626" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="سوق اليمن الدولي" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
          <Sonner position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  )
}
