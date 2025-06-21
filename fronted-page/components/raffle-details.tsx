"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"
import CountdownTimer from "@/components/countdown-timer"
import { Card } from "@/components/ui/card"
import { MessageSquare, Ticket, CreditCard } from "lucide-react"
import Link from "next/link"
import { Raffle } from "@/lib/raffle.type"
import { ImageUrlResolver } from "@/util/image-url-resolver"

export default function RaffleDetails({ raffle }: { raffle: Raffle }) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-[#00c2c7] rounded-lg p-6 mb-8 text-black text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-white rounded-full p-4 inline-block">
            <Image
              src={ImageUrlResolver.resolve(raffle.image)}
              alt={raffle.name}
              width={80}
              height={80}
              className="object-contain"
            />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{raffle.name}</h1>
        <p className="text-lg opacity-90 mb-4">Finaliza: {formatDate(raffle.endsAt)}</p>
        <CountdownTimer endDate={raffle.endsAt} />
      </div>

      <div className="bg-black rounded-lg p-6 mb-8 text-white text-center">
        <h2 className="text-xl mb-2 font-medium">Premio Estimado</h2>
        <p className="text-4xl md:text-5xl font-bold">${(raffle.initialAmount + raffle.accumulated).toLocaleString()} USD</p>
      </div>

      <Card className="mb-8 p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Cómo Comprar</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-[#ffcc00] text-black rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <MessageSquare size={32} />
            </div>
            <h3 className="font-bold mb-2">Paso 1</h3>
            <p>Haz clic en el botón de WhatsApp.</p>
          </div>
          <div className="text-center">
            <div className="bg-[#00c2c7] text-black rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Ticket size={32} />
            </div>
            <h3 className="font-bold mb-2">Paso 2</h3>
            <p>Escribele a nuestro chatbot.</p>
          </div>
          <div className="text-center">
            <div className="bg-[#ff3a8c] text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <CreditCard size={32} />
            </div>
            <h3 className="font-bold mb-2">Paso 3</h3>
            <p>Elige tus boletos y paga facilmente.</p>
          </div>
        </div>
      </Card>

      <div className="text-center space-y-4">
        <Link href='https://whatsApp.com'>
          <Button className="bg-[#00d65e] hover:bg-[#00c054] text-black px-8 py-6 text-xl rounded-lg font-bold">
            Comprar Boletos en WhatsApp
          </Button>
        </Link>


      </div>
    </div>
  )
}
