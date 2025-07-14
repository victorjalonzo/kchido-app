"use client"

import RaffleCard from "@/components/raffle-card"
import Header from "@/components/header"
import Image from "next/image"
import { useEffect, useState } from "react"
import { Raffle, RaffleStatus } from "@/lib/raffle.type"
import { RaffleAPI } from "@/lib/raffle.api"

export default function RafflesPage() {
  const [raffles, setRaffles] = useState<Raffle[]>([])

  useEffect(() => {
    const fetchRaffles = async () => {
      const raffles = await RaffleAPI.getAll({ 'winner-numbers': true })
      console.log('raffles:', raffles)
      setRaffles(raffles)
    }

    fetchRaffles()
  }, [])

  // Ordenar los sorteos: primero los ONGOING por fecha de finalización más cercana, luego los ENDED por fecha más reciente
  const sortedRaffles = [...raffles].sort((a, b) => {
    if (a.status === RaffleStatus.ONGOING && b.status !== RaffleStatus.ONGOING) return -1
    if (a.status !== RaffleStatus.ONGOING && b.status === RaffleStatus.ONGOING) return 1

    if (a.status === RaffleStatus.ONGOING && b.status === RaffleStatus.ONGOING) {
      return new Date(a.endsAt).getTime() - new Date(b.endsAt).getTime()
    }

    // Ambos son ENDED
    return new Date(b.endsAt).getTime() - new Date(a.endsAt).getTime()
  })

  return (
    <>
      <Header />
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8 relative overflow-hidden rounded-xl">
          <div className="absolute inset-0 bg-black/5 z-0"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center p-6 gap-6">
            <div className="md:w-1/3 flex justify-center">
              <Image
                src="/banner.png"
                alt="Sorteo"
                width={300}
                height={200}
                className="rounded-lg object-cover"
              />
            </div>
            <div className="md:w-2/3 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-black">Sorteos Disponibles</h1>
              <p className="text-black/80 text-lg">
                Participa en nuestros sorteos y gana premios increíbles. ¡Compra tus boletos ahora!
              </p>
            </div>
          </div>
        </div>

        {/* Todos los sorteos en una sola cuadrícula */}
        {sortedRaffles.length === 0 ? (
          <div className="flex items-center justify-center h-64 w-full">
            <p className="text-gray-500 text-xl text-center">
              No hay sorteos disponibles por el momento.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedRaffles.map((raffle) => (
              <RaffleCard key={raffle.id} raffle={raffle} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
