"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { formatDate } from "@/lib/utils"
import WinningNumbersDisplay from "./winning-numbers-display"
import { useRouter } from "next/navigation"
import { Raffle, RaffleStatus } from "@/lib/raffle.type"
import { ImageUrlResolver } from "@/util/image-url-resolver"

export default function RaffleCard({ raffle }: { raffle: Raffle }) {
  const router = useRouter()

  // Calculate days remaining for active raffles
  const getDaysRemaining = () => {
    if (raffle.status !== RaffleStatus.ONGOING) return null

    const now = new Date()
    const endDate = new Date(raffle.endsAt)
    const diffTime = endDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return diffDays
  }

  const daysRemaining = getDaysRemaining()
  const isUrgent = daysRemaining !== null && daysRemaining <= 3
  const isFinalized = raffle.status === RaffleStatus.ENDED

  const handleViewResults = () => {
    router.push(`/${raffle.id}`)
  }

  return (
    <Card
      className={`overflow-hidden border-2 ${
        isUrgent
          ? "border-[#ff3a8c] shadow-lg shadow-[#ff3a8c]/20"
          : raffle.status === RaffleStatus.ONGOING
            ? "border-[#00c2c7]/20 hover:border-[#00c2c7]"
            : "border-gray-200"
      } transition-all duration-300`}
    >
      <div className="h-40 bg-[#f8f8f8] flex items-center justify-center relative">
        <Image
          src={raffle.image}
          alt={raffle.name}
          width={120}
          height={120}
          className="object-contain"
        />
        {isUrgent && (
          <div className="absolute top-2 right-2 bg-[#ff3a8c] text-white px-2 py-1 rounded-md text-sm font-bold animate-pulse">
            ¡Termina pronto!
          </div>
        )}
      </div>
      <CardContent className="pt-6">
        <h3 className="text-xl font-bold mb-2">{raffle.name}</h3>
        <p className="text-sm text-gray-500 mb-2">
          {raffle.status === RaffleStatus.ONGOING ? "Finaliza" : "Finalizado"}: {formatDate(raffle.endsAt)}
        </p>
        <div
          className="inline-block px-3 py-1 rounded-full text-sm font-medium mb-2 mt-1"
          style={{
            backgroundColor: raffle.status === RaffleStatus.ONGOING ? "#00d65e" : "#f1f5f9",
            color: raffle.status === RaffleStatus.ONGOING ? "#000000" : "#64748b",
          }}
        >
          {raffle.status === RaffleStatus.ONGOING ? "En curso" : "Finalizado"}
        </div>
        {daysRemaining !== null && daysRemaining <= 7 && (
          <p className={`text-sm mt-1 ${isUrgent ? "text-[#ff3a8c] font-bold" : "text-[#ff3a8c]/80"}`}>
            {daysRemaining <= 0
              ? "¡Último día!"
              : daysRemaining === 1
                ? "¡Solo queda 1 día!"
                : `¡Solo quedan ${daysRemaining} días!`}
          </p>
        )}

        {isFinalized && raffle.winnerNumbers ? (
          <WinningNumbersDisplay
            winningNumbers={raffle.winnerNumbers}
            endDate={raffle.endsAt}
            onClick={handleViewResults}
          />
        ) : (
          <div className="mt-3 bg-black text-white p-3 rounded-md">
            <p className="text-sm opacity-80">Premio Estimado:</p>
            <p className="text-lg font-bold">${ raffle.accumulated.toLocaleString()} USD</p>
          </div>
        )}
      </CardContent>

      {!isFinalized && (
        <CardFooter>
          <Link href={`/${raffle.id}`} className="w-full">
            <Button
              className={`w-full ${
                raffle.status === RaffleStatus.ONGOING
                  ? isUrgent
                    ? "bg-[#ff3a8c] hover:bg-[#e0307a]"
                    : "bg-[#00d65e] hover:bg-[#00c054] text-black"
                  : "bg-gray-600 hover:bg-gray-700"
              } ${raffle.status === RaffleStatus.ONGOING && !isUrgent ? "text-black" : "text-white"}`}
            >
              Ver Detalles
            </Button>
          </Link>
        </CardFooter>
      )}
    </Card>
  )
}
