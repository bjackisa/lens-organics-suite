import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

export const metadata: Metadata = {
  title: "Lens Organics Suite",
  description: "Enterprise management system for Lens Organics",
  manifest: "/manifest.json",
  themeColor: "#2d5016",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Lens Organics",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192.jpg" />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
