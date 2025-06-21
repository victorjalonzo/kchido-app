'use client'

import CheckoutForm from "@/components/checkout-form"
import { Order } from "@/lib/order.type"
import { Raffle } from "@/lib/raffle.type"
import { TicketReservation } from "@/lib/ticket-reservation.type"

interface CheckoutPageProps {
  order: Order
  raffle: Raffle
  ticketReservations: TicketReservation[]
}

export default function CheckoutPage({ order, raffle, ticketReservations }: CheckoutPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <CheckoutForm 
          order={order}
          raffle={raffle} 
          ticketNumbers={ticketReservations} 
        />
      </div>
    </div>
  )
}
