"use client"

import type React from "react"
import Sidebar from "@/shared/components/sidebar"
import Header from "@/shared/components/header"
import { Toaster } from "@/shared/components/ui/toaster"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { AuthProvider, useAuth } from "@/features/auth/auth-provider"
import ThemeProvider from "@/shared/components/theme-provider"

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return (
      <ThemeProvider attribute="class" defaultTheme="light">
        <div className="flex h-screen items-center justify-center">
          <span className="text-muted-foreground">Loading...</span>
        </div>
      </ThemeProvider>
    )
  }

  return <>{children}</>
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <AuthProvider>
        <AuthGuard>
          <div className="flex h-screen">
            <Sidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
              <Header />
              <main className="flex-1 overflow-y-auto bg-background p-6">{children}</main>
            </div>
          </div>
          <Toaster />
        </AuthGuard>
      </AuthProvider>
    </ThemeProvider>
  )
}
