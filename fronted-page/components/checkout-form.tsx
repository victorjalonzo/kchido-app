"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Ticket } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { Raffle } from "@/lib/raffle.type"
import { TicketReservation } from "@/lib/ticket-reservation.type"
import { ImageUrlResolver } from "@/util/image-url-resolver"
import PayPalButton from "./paypal-button"
import { Order } from "@/lib/order.type"

interface CheckoutFormProps {
  order: Order 
  raffle: Raffle
  ticketNumbers: TicketReservation[]
}


export default function CheckoutForm({ order, raffle, ticketNumbers }: CheckoutFormProps) {
  const ticketPrice = raffle.pricePeerTicket
  const ticketCount = ticketNumbers.length
  const subtotal = ticketCount * ticketPrice
  const processingFee = 0 
  const total = subtotal + processingFee

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back Button */}
      <div className="mb-6">
        <Link
          href={`/${raffle.id}`}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
        >
          <ArrowLeft size={20} />
          Volver al sorteo
        </Link>
      </div>

      {/* Page Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Finalizar Compra</h1>
        <p className="text-gray-600">Confirma tu orden y procede al pago</p>
      </div>

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ticket className="text-[#00c2c7]" size={24} />
            Resumen de la Orden
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Raffle Info */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
              <Image
                src={ImageUrlResolver.resolve(raffle.image)}
                alt={raffle.name}
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <div>
              <h3 className="font-bold text-lg">{raffle.name}</h3>
              <p className="text-sm text-gray-500">Finaliza: {formatDate(raffle.endsAt)}</p>
              <p className="text-sm font-medium text-[#00d65e]">Premio: ${raffle.accumulated.toLocaleString()} USD</p>
            </div>
          </div>

          {/* Ticket Numbers */}
          <div className="mb-6">
            <h4 className="font-medium mb-3">Boletos Seleccionados:</h4>
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
              {ticketNumbers.map((number, index) => (
                <div
                  key={index}
                  className="bg-black text-white font-medium text-center py-1 px-1 rounded border border-white/20 text-xs
"
                >
                  #{number.serial}
                </div>
              ))}
            </div>
          </div>

          <Separator className="my-4" />

          {/* Price Breakdown */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span >
                {ticketCount} boleto{ticketCount > 1 ? "s" : ""} × ${ticketPrice}
              </span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Comisión de procesamiento</span>
              <span>${processingFee.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-[#00d65e]">${total.toFixed(2)} USD</span>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Payment Button */}
          <div className="space-y-4">
            <PayPalButton order={order}></PayPalButton>


            <div className="text-center">
              <p className="text-sm text-gray-500">Pago seguro procesado por PayPal</p>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">🔒 Compra Segura</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Pago procesado de forma segura</li>
              <li>• Números de boletos enviados por WhatsApp</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
