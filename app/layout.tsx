import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { NuqsAdapter } from "nuqs/adapters/next"

import "./globals.css"

const geistSans = Geist({ subsets: ["latin"], variable: "--font-sans" })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" })

export const metadata: Metadata = {
  title: "ffmgen - Generate FFmpeg Commands with AI",
  description:
    "Describe what you want to do with your video or audio and get the exact ffmpeg command. Powered by AI.",
  openGraph: {
    title: "ffmgen - Generate FFmpeg Commands with AI",
    description:
      "Describe what you want to do with your video or audio and get the exact ffmpeg command. Powered by AI.",
    images: [{ url: "/ffmgen-banner.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ffmgen - Generate FFmpeg Commands with AI",
    description:
      "Describe what you want to do with your video or audio and get the exact ffmpeg command. Powered by AI.",
    images: ["/ffmgen-banner.png"],
  },
}

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <NuqsAdapter>{children}</NuqsAdapter>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
