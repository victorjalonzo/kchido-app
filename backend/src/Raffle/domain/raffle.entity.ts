export enum RaffleStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  FINALIZED = 'finalized'
}

export interface Props {
  id: string,
  name: string,
  image: string | null,
  description: string | null
  pricePeerTicket: number,
  initialAmount: number,
  totalAmount: number,
  subscribers: number,
  status: RaffleStatus,
  winnerNumbers: string | null,
  createdBy: string,
  createdAt: Date,
  endsAt: Date,
}

export class Raffle implements Props {
  id: string
  name: string
  description: string | null
  image: string | null
  pricePeerTicket: number
  initialAmount: number
  totalAmount: number
  subscribers: number
  status: RaffleStatus
  winnerNumbers: string | null
  createdBy: string
  createdAt: Date
  endsAt: Date

  constructor (props: Props){
    this.id = props.id
    this.name = props.name,
    this.description = props.description
    this.image = props.image
    this.pricePeerTicket = props.pricePeerTicket
    this.initialAmount = props.initialAmount
    this.totalAmount = props.totalAmount
    this.subscribers = props.subscribers
    this.status = props.status
    this.winnerNumbers = props.winnerNumbers
    this.createdBy = props.createdBy
    this.createdAt = props.createdAt
    this.endsAt = props.endsAt
  }
}
  