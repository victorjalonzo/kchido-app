import { notFound } from "next/navigation"
import SuccessMessage from "@/components/success-message"
import { Order, OrderStatus } from "@/lib/order.type"
import { OrderAPI } from "@/lib/order.api"
import { Raffle } from "@/lib/raffle.type"
import { Ticket } from "@/lib/ticket.type"
import { redirect } from "next/navigation"

interface SuccessPageProps {
  params?: { id: string }
  order?: Order
}

export default async function SuccessPage({ params, order }: SuccessPageProps) {
  let currentOrder: Order | null = null

  if (!order) {
    if (!params) return notFound()
    const { id } = await params

    if (!id) return notFound()

    currentOrder = await OrderAPI.getById(id, { raffle: true , tickets: true})
  }
  else {
    currentOrder = order
  }

  if (currentOrder.status == OrderStatus.PENDING) {
    return redirect(`/checkout/${currentOrder.id}`)
  }

  const orderId = currentOrder.shortId
  const raffle = currentOrder.raffle as Raffle
  const ticketNumbers = currentOrder.tickets as Ticket[]
  const ticketCount = currentOrder.tickets?.length as number

  console.log(currentOrder)

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <SuccessMessage raffle={raffle} ticketCount={ticketCount} ticketNumbers={ticketNumbers} orderId={orderId} />
      </div>
    </div>
  )
}
