export interface User {
    id: string
    name: string
    email?: string
    number?: string
    image?: string
    createdAt: string
    role: "seller" | "bot" | "admin"
    permissions?: string[]
  }