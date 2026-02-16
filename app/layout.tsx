import type { Metadata, Viewport } from "next"
import Script from "next/script"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { NuqsAdapter } from "nuqs/adapters/next"
import { ThemeProvider } from "@/components/theme-provider"

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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          defer
          src="https://st.nickradford.dev/script.js"
          data-website-id="d439cd38-d158-4721-ac7c-9a312054dfa4"
          data-domains="ffmgen.nickradford.dev"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NuqsAdapter>{children}</NuqsAdapter>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
