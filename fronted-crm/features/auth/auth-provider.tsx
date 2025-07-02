// auth-provider.tsx
"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AuthAPI } from "./api/auth.api"
import { ImageFormat } from "@/shared/lib/formatImage"
import { User } from "./user.type"

interface AuthContextType {
  user: User | null
  login: (credentials: { email: string; password: string }) => Promise<void>
  logout: () => void
  update: (payload: Partial<User>) => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()


  useEffect(() => {
    const initialize = async () => {
      try {
        const user = await AuthAPI.get()
        if (user.image) user.image = ImageFormat(user.image)
        setUser(user)
      } catch (err) {
        setUser(null)
        logout()
      } finally {
        setIsLoading(false)
      }
    }
    initialize()
  }, [])

  const _setFormatedUser = (user: User) => {
    if (user.image) user.image = ImageFormat(user.image)
      setUser(user)
  }

  const login = async ({ email, password }: { email: string; password: string }) => {
    const token = await AuthAPI.login({ email, password })
    document.cookie = `jwt=${token}; path=/; secure; samesite=strict`
    
    const user = await AuthAPI.get()
    _setFormatedUser(user)

    router.push("/dashboard")
  }

  const update = async (payload: Partial<User>): Promise<void> => {
    const user = await AuthAPI.update(payload)
    _setFormatedUser(user)
  }

  const logout = () => {
    setUser(null)
    document.cookie = "jwt=; Max-Age=0; path=/"
    router.push("/login")
  }

  return (
    <AuthContext.Provider value={{ user, login, update, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be use inside AuthProvider")
  return context
}

