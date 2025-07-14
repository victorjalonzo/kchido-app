import { notFound, redirect } from "next/navigation"
import { OrderAPI } from "@/lib/order.api"
import { Raffle } from "@/lib/raffle.type"
import { TicketReservation } from "@/lib/ticket-reservation.type"

import CheckoutForm from "@/components/checkout-form"
import { Order, OrderStatus } from "@/lib/order.type"


interface CheckoutPageProps {
    params: { id: string }
}

export default async function CheckoutPage({ params}: CheckoutPageProps) {
    const { id } = await params

    let order: Order | null = null
    
    try {
        order = await OrderAPI.getById(id, {
            raffle: true,
            tickets: true,
            'ticket-reservations': true,
        })
    }
    catch(e) {
        notFound()
    }

    if (order.status == OrderStatus.COMPLETED) {
        redirect(`/success/${order.id}`)
    }

    const raffle = order.raffle as Raffle
    const ticketNumbers = order.ticketReservations as TicketReservation[]

    return (
        <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto py-8 px-4">
            <CheckoutForm 
            order={order}
            raffle={raffle} 
            ticketNumbers={ticketNumbers} 
            />
        </div>
        </div>
    )
}
