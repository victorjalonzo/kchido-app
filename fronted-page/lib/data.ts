import type { Raffle } from "./types"

const iconURL = "/default-raffle.png"

// Sample raffle data with varied end dates
const raffles: Raffle[] = [
  {
    id: "1",
    name: "Sorteo Nacional",
    iconUrl: iconURL,
    endDate: "2025-05-17T18:00:00", // Further in the future
    status: "public",
    prizeAmount: 4500,
    whatsappLink: "https://wa.me/1234567890",
  },
  {
    id: "2",
    name: "Lotería Especial",
    iconUrl: iconURL,
    endDate: "2025-05-14T15:00:00",
    status: "finalized",
    prizeAmount: 6000,
    whatsappLink: "https://wa.me/1234567890",
    winningNumbers: ["4", "10", "24", "29", "53", "4"],
  },
  {
    id: "3",
    name: "Gran Sorteo Mensual",
    iconUrl: iconURL,
    endDate: "2025-05-20T20:00:00", // Ending soon (relative to current date)
    status: "public",
    prizeAmount: 5700,
    whatsappLink: "https://wa.me/1234567890",
  },
  {
    id: "4",
    name: "Sorteo Extraordinario",
    iconUrl: iconURL,
    endDate: "2025-04-15T12:00:00",
    status: "finalized",
    prizeAmount: 3200,
    whatsappLink: "https://wa.me/1234567890",
    winningNumbers: ["12", "33", "45", "06", "19", "7"],
  },
  {
    id: "5",
    name: "Sorteo Semanal",
    iconUrl: iconURL,
    endDate: "2025-05-19T23:59:59", // Very close to ending
    status: "public",
    prizeAmount: 7800,
    whatsappLink: "https://wa.me/1234567890",
  },
]

export function getRaffles(): Raffle[] {
  return raffles
}

export function getRaffleById(id: string): Raffle | undefined {
  return raffles.find((raffle) => raffle.id === id)
}
