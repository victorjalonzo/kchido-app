"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useAuth } from "@/features/auth/auth-provider"

type Props = {
  children: React.ReactNode
  permission: string
}

export default function PermissionGuard({ children, permission }: Props) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user && !user.permissions?.[permission]) {
      router.push("/dashboard")
    }
  }, [user, isLoading, permission, router])

  if (isLoading || !user) {
    return <div className="text-muted-foreground">Cargando...</div>
  }

  if (!user.permissions?.[permission]) {
    return null
  }

  return <>{children}</>
}
