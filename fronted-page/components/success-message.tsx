"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { CheckCircle, Ticket, ArrowLeft, Share2, Download } from "lucide-react"
import { formatDate } from "@/lib/utils"
import Confetti from "@/components/confetti"
import { ImageUrlResolver } from "@/util/image-url-resolver"
import { Raffle } from "@/lib/raffle.type"
import { Ticket as TicketType } from "@/lib/ticket.type"

interface SuccessMessageProps {
  raffle: Raffle
  ticketCount: number
  ticketNumbers: TicketType[]
  orderId: string
}

export default function SuccessMessage({ raffle, ticketCount, ticketNumbers, orderId }: SuccessMessageProps) {
  const [showConfetti, setShowConfetti] = useState(true)
  const [timeLeft, setTimeLeft] = useState(10)

  useEffect(() => {
    // Auto-redirect countdown
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeLeft])

  return (
    <>
      {showConfetti && <Confetti duration={5000} onComplete={() => setShowConfetti(false)} />}

      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#00d65e] rounded-full mb-4">
            <CheckCircle className="text-white" size={40} />
          </div>
          <h1 className="text-3xl font-bold mb-2">¡Pago Completado!</h1>
          <p className="text-gray-600">Tu compra ha sido procesada exitosamente. Tus boletos están confirmados.</p>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            {/* Order Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
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
                  <p className="text-sm font-medium text-[#00d65e]">
                    Premio: ${raffle.accumulated.toLocaleString()} USD
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Número de Orden:</span>
                  <span className="font-medium">{orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fecha:</span>
                  <span className="font-medium">{new Date().toLocaleDateString()}</span>
                </div>
              </div>

              {/* Ticket Numbers */}
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Ticket size={18} className="text-[#00c2c7]" />
                  Tus Boletos Confirmados:
                </h4>
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
                  {ticketNumbers.map((ticket, index) => (
                    <div
                      key={index}
                      className="bg-black text-white  font-medium text-center py-1 px-1 rounded border border-[#00d65e]/20 text-xs"
                    >
                      #{ticket.serial}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {ticketCount} boleto{ticketCount > 1 ? "s" : ""} comprado{ticketCount > 1 ? "s" : ""}
                </p>
              </div>

              {/* Next Steps */}
              <div className="bg-[#00c2c7]/10 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Próximos Pasos:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Tus boletos serán enviados por WhatsApp</li>
                  <li>• El sorteo se realizará en la fecha indicada</li>
                  <li>• Los resultados serán publicados en nuestra plataforma</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button className="flex-1 bg-[#00d65e] hover:bg-[#00c054] text-black">
              <Share2 size={18} className="mr-2" />
              Compartir Boletos
            </Button>
            <Button variant="outline" className="flex-1">
              <Download size={18} className="mr-2" />
              Descargar Recibo
            </Button>
          </div>

          <div className="bg-black text-white p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Volver al Bot</h4>
                <p className="text-sm text-gray-300">Regresando automáticamente en {timeLeft} segundos...</p>
              </div>
              <Link href="https://wa.me/1234567890">
                <Button className="bg-[#25D366] hover:bg-[#128C7E] text-white">
                  <ArrowLeft size={18} className="mr-2" />
                  Volver al Chat
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
