export enum RaffleVisibility {
  PUBLIC = 'public',
  PRIVATE = 'private'
}

export enum RaffleStatus {
  ONGOING = 'ongoing',
  ENDED = 'ended'
}

export interface Raffle {
    id: string
    name: string
    description: string | null
    image: string | null
    pricePeerTicket: number
    initialAmount: number
    accumulated: number
    subscribers: number
    status: RaffleStatus
    visibility: RaffleVisibility
    createdBy: string
    createdAt: string
    endsAt: string
    
    
    winnerNumbers?: []
    //tickets?: Ticket[]
    //orders?: Order[]
}