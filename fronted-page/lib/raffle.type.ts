export enum RaffleVisibility {
  PUBLIC = 'public',
  PRIVATE = 'private'
}

export enum RaffleStatus {
  ONGOING = 'ongoing',
  ENDED = 'ended'
}

export interface WinnerNumber {
  id: string
  serial: string
  raffleId: string 
}

export interface Raffle {
    id: string
    name: string
    description: string | null
    image: string
    pricePeerTicket: number
    accumulated: number
    status: RaffleStatus
    visibility: RaffleVisibility
    createdAt: string
    endsAt: string
    
    winnerNumbers?: WinnerNumber[]
}