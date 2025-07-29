import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import TopNavigation from "@/components/layout/top-navigation"
import LeftSidebar from "@/components/layout/left-sidebar"
import { ThemeProvider } from "@/lib/theme-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Jira Clone - Project Management",
  description: "A project management web app inspired by Jira",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider defaultTheme="system" storageKey="ui-theme">
          <div className="min-h-screen bg-gray-50 dark:bg-zinc-950">
            <TopNavigation />
            <div className="flex">
              <LeftSidebar />
              <main className="flex-1 ml-64 pt-16">
                <div className="p-6">{children}</div>
              </main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
