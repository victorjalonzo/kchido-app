"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { XCircle, RefreshCw, ArrowLeft, MessageCircle, CreditCard } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { Raffle } from "@/lib/raffle.type"

interface FailureMessageProps {
  raffle: Raffle
  ticketCount: number
  ticketNumbers: string[]
  errorReason: string
}

export default function FailureMessage({ raffle, ticketCount, ticketNumbers, errorReason }: FailureMessageProps) {
  const [timeLeft, setTimeLeft] = useState(15)

  useEffect(() => {
    // Auto-redirect countdown
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeLeft])

  const getErrorMessage = (error: string) => {
    switch (error) {
      case "payment_cancelled":
        return {
          title: "Pago Cancelado",
          description: "Has cancelado el proceso de pago. Tus boletos no han sido reservados.",
          icon: "⚠️",
        }
      case "insufficient_funds":
        return {
          title: "Fondos Insuficientes",
          description: "No hay suficientes fondos en tu cuenta para completar esta transacción.",
          icon: "💳",
        }
      case "payment_declined":
        return {
          title: "Pago Rechazado",
          description: "Tu método de pago ha sido rechazado. Por favor, verifica tu información.",
          icon: "❌",
        }
      case "network_error":
        return {
          title: "Error de Conexión",
          description: "Hubo un problema de conexión. Por favor, intenta nuevamente.",
          icon: "🌐",
        }
      default:
        return {
          title: "Pago No Completado",
          description: "No se pudo procesar tu pago. Por favor, intenta nuevamente.",
          icon: "❌",
        }
    }
  }

  const errorInfo = getErrorMessage(errorReason)

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
          <XCircle className="text-red-500" size={40} />
        </div>
        <h1 className="text-3xl font-bold mb-2 text-red-600">{errorInfo.title}</h1>
        <p className="text-gray-600">{errorInfo.description}</p>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          {/* Order Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                <Image
                  src={raffle.image || "/placeholder.svg"}
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

            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{errorInfo.icon}</span>
                <h4 className="font-medium text-red-800">Estado del Pago</h4>
              </div>
              <p className="text-red-700 text-sm">
                El pago no se completó exitosamente. Los boletos seleccionados no han sido reservados y están
                disponibles para otros compradores.
              </p>
            </div>

            {/* Ticket Numbers that were attempted */}
            {ticketNumbers.length > 0 && (
              <div>
                <h4 className="font-medium mb-3 text-gray-600">Boletos que Intentaste Comprar:</h4>
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
                  {ticketNumbers.map((number, index) => (
                    <div
                      key={index}
                      className="bg-gray-100 text-gray-500 font-medium text-center py-1 px-1 rounded border border-gray-200 text-xs"
                    >
                      #{number}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {ticketCount} boleto{ticketCount > 1 ? "s" : ""} no reservado{ticketCount > 1 ? "s" : ""}
                </p>
              </div>
            )}

            {/* Common Solutions */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2 text-blue-800">💡 Posibles Soluciones:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Verifica que tu método de pago tenga fondos suficientes</li>
                <li>• Asegúrate de que tu conexión a internet sea estable</li>
                <li>• Intenta usar un método de pago diferente</li>
                <li>• Contacta a tu banco si el problema persiste</li>
                <li>• Habla con nuestro soporte por WhatsApp</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href={`/mypage/raffles/${raffle.id}/checkout?tickets=${ticketCount}&numbers=${ticketNumbers.join(",")}`}
            className="flex-1"
          >
            <Button className="w-full bg-[#00d65e] hover:bg-[#00c054] text-black">
              <RefreshCw size={18} className="mr-2" />
              Intentar Nuevamente
            </Button>
          </Link>
          <Link href={`/mypage/raffles/${raffle.id}`} className="flex-1">
            <Button variant="outline" className="w-full">
              <CreditCard size={18} className="mr-2" />
              Elegir Otros Boletos
            </Button>
          </Link>
        </div>

        <div className="bg-[#25D366] text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">¿Necesitas Ayuda?</h4>
              <p className="text-sm text-green-100">Nuestro equipo de soporte está disponible 24/7</p>
            </div>
            <Link href="https://wa.me/1234567890">
              <Button className="bg-white text-[#25D366] hover:bg-gray-100">
                <MessageCircle size={18} className="mr-2" />
                Contactar Soporte
              </Button>
            </Link>
          </div>
        </div>

        <div className="bg-black text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Volver al Bot</h4>
              <p className="text-sm text-gray-300">Regresando automáticamente en {timeLeft} segundos...</p>
            </div>
            <Link href="https://wa.me/1234567890">
              <Button className="bg-gray-700 hover:bg-gray-600 text-white">
                <ArrowLeft size={18} className="mr-2" />
                Volver al Chat
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
