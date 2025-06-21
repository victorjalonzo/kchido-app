import Image from "next/image"
import { formatDate, formatDateShort } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Raffle } from "@/lib/raffle.type"
import { ImageUrlResolver } from "@/util/image-url-resolver"

export default function RaffleFinalized({ raffle }: { raffle: Raffle }) {
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
        <p className="text-lg opacity-90">Finalizado: {formatDate(raffle.endsAt)}</p>
      </div>

      <Card className="mb-8 p-6 border-2 border-[#00d65e]">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">Números Ganadores</h2>
        <p className="text-center text-gray-600 mb-4">{formatDateShort(raffle.endsAt)}</p>

        {raffle.winnerNumbers && (
          <div className="flex justify-center gap-3 mb-6">
            {raffle.winnerNumbers.map((winnerNumber, index) => (
              <div
                key={index}
                className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-800 font-bold text-xl"
              >
                {winnerNumber.serial}
              </div>
            ))}
            {raffle.winnerNumbers.length > 0 && (
              <div className="w-12 h-12 bg-[#ff3a8c] rounded-full flex items-center justify-center text-white font-bold text-xl">
                {raffle.winnerNumbers[raffle.winnerNumbers.length - 1].serial}
              </div>
            )}
          </div>
        )}

        <div className="text-center mt-6">
          <p className="text-lg font-bold text-black">Premio: ${raffle.accumulated.toLocaleString()} USD</p>
        </div>
      </Card>

      <div className="text-center text-gray-500">
        <p>Este sorteo ha finalizado. ¡Gracias por participar!</p>
        <p className="mt-2">Consulta nuestros otros sorteos activos.</p>
      </div>
    </div>
  )
}
