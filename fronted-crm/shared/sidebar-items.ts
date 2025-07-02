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
} from "lucide-react"
import { PERMISSIONS } from "@/features/auth/permission-enum"

export  const sidebarItems = [
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