"use client"

import { notFound } from "next/navigation"
import RaffleDetails from "@/components/raffle-details"
import RaffleFinalized from "@/components/raffle-finalized"
import Header from "@/components/header"
import { use, useEffect, useState } from "react"
import { Raffle, RaffleStatus } from "@/lib/raffle.type"
import { RaffleAPI } from "@/lib/raffle.api"

export default function RafflePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params) // ✅ Desempaquetamos correctamente con React.use

  const [raffle, setRaffle] = useState<Raffle | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRaffle = async () => {
      try {
        const data = await RaffleAPI.getById(id, {'winner-numbers': true})
        if (!data) {
          notFound()
          return
        }
        setRaffle(data)
      } catch (error) {
        notFound()
      } finally {
        setIsLoading(false)
      }
    }

    fetchRaffle()
  }, [id])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold">Cargando rifa...</p>
      </div>
    )
  }

  if (!raffle) {
    notFound()
  }

  return (
    <>
      <Header />
      <div className="container mx-auto py-8 px-4">
        {raffle.status === RaffleStatus.ONGOING
          ? <RaffleDetails raffle={raffle} />
          : <RaffleFinalized raffle={raffle} />
        }
      </div>
    </>
  )
}
