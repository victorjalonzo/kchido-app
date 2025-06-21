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
        {winningNumbers.map((winnerNumber, index) => (
          <div
            key={index}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-800 font-bold text-sm"
          >
            {winnerNumber.serial}
          </div>
        ))}
        {winningNumbers.length > 0 && (
          <div className="w-8 h-8 rounded-full bg-[#ff3a8c] flex items-center justify-center text-white font-bold text-sm">
            {winningNumbers[winningNumbers.length - 1].serial}
          </div>
        )}
      </div>

      <button
        onClick={onClick}
        className="w-full bg-black hover:bg-gray-800 text-white py-2 rounded text-sm font-medium transition-colors"
      >
        VIEW RESULTS
      </button>
    </div>
  )
}
