"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/shared/lib/utils"
import {
  ShoppingCart,
  Gift,
  Users,
  User,
  CreditCard,
  MessageSquare,
  CheckSquare,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react"
import { useAuth } from "@/features/auth/auth-provider"
import { PERMISSIONS } from "@/features/auth/permission-enum"

const sidebarItems = [
  { 
    name: "Panel", 
    href: "/dashboard", 
    icon: BarChart3
  },
  { 
    name: "Sorteos", 
    href: "/dashboard/raffles", 
    icon: Gift, 
    require: PERMISSIONS.MANAGE_RAFFLES
  },
  { 
    name: "Emision de boletos", 
    href: "/dashboard/ticket-validation", 
    icon: CheckSquare, 
    require: PERMISSIONS.MANAGE_TICKETS
  },
  { 
    name: "Vendedores", 
    href: "/dashboard/sellers", 
    icon: Users, 
    require: PERMISSIONS.MANAGE_SELLERS
  },
  { 
    name: "Ordenes", 
    href: "/dashboard/orders", 
    icon: ShoppingCart,
    require: PERMISSIONS.MANAGE_ORDERS
  },
  { 
    name: "Clientes", 
    href: "/dashboard/customers", 
    icon: User, 
    require: PERMISSIONS.MANAGE_CUSTOMERS
  },
  { 
    name: "Proveedor de pago", 
    href: "/dashboard/payment-providers", 
    icon: CreditCard, 
    require: PERMISSIONS.MANAGE_PAYMENT_METHODS
  },
  { 
    name: "Chatbot", 
    href: "/dashboard/chatbot", 
    icon: MessageSquare, 
    require: PERMISSIONS.MANAGE_CHATBOT
  },
  { 
    name: "Configuracion", 
    href: "/dashboard/settings", icon: Settings 
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { logout, user } = useAuth()

  return (
    <div className="hidden md:flex flex-col w-64 bg-card border-r h-screen">
      <div className="p-6">
        <h1 className="text-2xl font-bold">KChido</h1>
      </div>

      <div className="flex-1 px-4 space-y-1">
        {sidebarItems.map((item) => {
          if (item.require) {
            if (!user?.permissions[item.require]) return
          }

          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-4 py-2.5 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <Icon className="h-5 w-5 mr-3" />
              {item.name}
            </Link>
          )
        })}
      </div>

      <div className="p-4 border-t">
        <button
          onClick={logout}
          className="flex w-full items-center px-4 py-2.5 rounded-md text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  )
}
