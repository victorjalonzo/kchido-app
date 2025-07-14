"use client"

import { WinnerNumber } from "@/lib/raffle.type"
import { formatDateShort } from "@/lib/utils"

interface WinningNumbersDisplayProps {
  winningNumbers: WinnerNumber[]
  endDate: string
  onClick: () => void
}

export default function WinningNumbersDisplay({ winningNumbers, endDate, onClick }: WinningNumbersDisplayProps) {
  if (!winningNumbers || winningNumbers.length === 0) return null

  return (
    <div className="bg-white rounded-lg shadow-md p-3 mt-3 border border-gray-100">
      <div className="bg-white border border-gray-200 rounded-md text-center py-1 mb-2">
        <h4 className="font-bold text-gray-800">Numeros Ganadores</h4>
      </div>

      <div className="text-center text-sm text-gray-600 mb-3">{formatDateShort(endDate)}</div>

      <div className="flex justify-center gap-1 mb-3">
      {winningNumbers.map((winnerNumber, index) => {
  const isLast = index === winningNumbers.length - 1
  return (
    <div
      key={index}
      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
        isLast
          ? 'bg-[#ff3a8c] text-white'
          : 'bg-gray-100 text-gray-800'
      }`}
    >
      {winnerNumber.serial}
    </div>
  )
})}
      </div>

      <button
        onClick={onClick}
        className="w-full bg-black hover:bg-gray-800 text-white py-2 rounded text-sm font-medium transition-colors"
      >
        VER RESULTADOS
      </button>
    </div>
  )
}
