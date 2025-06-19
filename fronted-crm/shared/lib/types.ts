// API Types

export interface Raffle {
  id: string
  name: string
  image: string
  pricePeerTicket: number
  initialAmount: number
  totalAmount: number
  subscribers: number
  createdAt: string
  endsAt: string
  status: "public" | "private" | "finalized"
  description?: string
  winnerNumbers?: string[]
}

export interface Ticket {
  id: string
  raffleId: string
  raffleName: string
  userId: string
  userName: string
  userEmail: string
  purchaseDate: string
  status: "valid" | "invalid"
}

export interface User {
  id: string
  name: string
  email?: string
  number?: string
  image?: string
  createdAt: string
  role: "seller" | "customer" | "admin"
  permissions?: string[]
  tickets?: number
  status: "active" | "banned"
}

export interface ChatbotSettings {
  isActive: boolean
  name: string
  welcomeMessage: string
  phoneNumber: string
}

export interface PaymentProvider {
  provider: "paypal" | "stripe"
  isConnected: boolean
  credentials: {
    apiKey?: string
    clientId?: string
    clientSecret?: string
  }
}

export interface Order {
  id: string
  status: "pending" | "completed" | "cancelled"
  tickets: Ticket[]
  totalPrice: number
  paymentMethod: "paypal" | "stripe" | "credit_card" | "bank_transfer"
  user: {
    id: string
    name: string
    email?: string
    phone?: string
    image?: string
  }
  createdAt: string
  updatedAt?: string
  notes?: string
  transactionId?: string
}
