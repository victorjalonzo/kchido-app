import { Order } from "src/Order/domain/order.entity"
import { Ticket } from "src/Ticket/domain/ticket.entity"
import { User } from "src/User/domain/user.entity"
import { WinnerNumber } from "src/WinnerNumber/domain/winner-number.entity"

export enum RaffleVisibility {
  PUBLIC = 'public',
  PRIVATE = 'private'
}

export enum RaffleStatus {
  ONGOING = 'ongoing',
  ENDED = 'ended'
}

export interface Props {
  id: string,
  shortId: string
  name: string,
  image: string | null,
  description: string | null
  pricePeerTicket: number,
  initialAmount: number,
  accumulated: number,
  subscribers: number,
  status: RaffleStatus,
  visibility: RaffleVisibility,
  whatsAppGroupId: string | null
  creatorId: string,
  createdAt: Date,
  endsAt: Date,

  creator?: User
  participants?: User[]
  
  tickets?: Ticket[]
  orders?: Order[]
  winnerNumbers?: WinnerNumber[],
}

export class Raffle implements Props {
  id: string
  shortId: string
  name: string
  description: string | null
  image: string | null
  pricePeerTicket: number
  initialAmount: number
  accumulated: number
  subscribers: number
  status: RaffleStatus
  visibility: RaffleVisibility
  whatsAppGroupId: string | null
  creatorId: string
  createdAt: Date
  endsAt: Date

  creator?: User
  participants: User[]
  
  tickets: Ticket[]
  orders: Order[]
  winnerNumbers: WinnerNumber[]

  constructor (props: Props){
    this.id = props.id
    this.shortId = props.shortId
    this.name = props.name,
    this.description = props.description
    this.image = props.image
    this.pricePeerTicket = props.pricePeerTicket
    this.initialAmount = props.initialAmount
    this.accumulated = props.accumulated
    this.subscribers = props.subscribers
    this.status = props.status
    this.visibility = props.visibility
    this.whatsAppGroupId = props.whatsAppGroupId
    this.creatorId = props.creatorId
    this.createdAt = props.createdAt
    this.endsAt = props.endsAt

    this.creator = props.creator
    this.participants = props.participants ?? []
    
    this.tickets = props.tickets ?? []
    this.orders = props.orders ?? []
    this.winnerNumbers = props.winnerNumbers ?? []
  }
}
  