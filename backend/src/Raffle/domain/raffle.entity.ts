import { Order } from "src/Order/domain/order.entity"
import { Ticket } from "src/Ticket/domain/ticket.entity"
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
  name: string,
  image: string | null,
  description: string | null
  pricePeerTicket: number,
  initialAmount: number,
  accumulated: number,
  subscribers: number,
  status: RaffleStatus,
  visibility: RaffleVisibility,
  winnerNumbers?: WinnerNumber[],
  createdBy: string,
  createdAt: Date,
  endsAt: Date,

  tickets?: Ticket[]
  orders?: Order[]
}

export class Raffle implements Props {
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
  winnerNumbers: WinnerNumber[]
  createdBy: string
  createdAt: Date
  endsAt: Date

  tickets?: Ticket[]
  orders?: Order[]

  constructor (props: Props){
    this.id = props.id
    this.name = props.name,
    this.description = props.description
    this.image = props.image
    this.pricePeerTicket = props.pricePeerTicket
    this.initialAmount = props.initialAmount
    this.accumulated = props.accumulated
    this.subscribers = props.subscribers
    this.status = props.status
    this.visibility = props.visibility
    this.winnerNumbers = props.winnerNumbers ?? []
    this.createdBy = props.createdBy
    this.createdAt = props.createdAt
    this.endsAt = props.endsAt

    this.tickets = props.tickets ?? []
    this.orders = props.orders ?? []
  }
}
  