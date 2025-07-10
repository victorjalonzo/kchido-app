import { WinnerNumber } from "src/WinnerNumber/domain/winner-number.entity"
import { RaffleStatus, RaffleVisibility } from "./raffle.entity"

export interface PublicRaffleProps {
  id: string,
  shortId: string
  name: string,
  image: string | null,
  description: string | null
  pricePeerTicket: number,
  accumulated: number,
  status: RaffleStatus,
  visibility: RaffleVisibility,
  createdAt: Date,
  endsAt: Date,
  
  winnerNumbers?: WinnerNumber[],
}

export class PublicRaffle implements PublicRaffleProps {
  id: string
  shortId: string
  name: string
  description: string | null
  image: string | null
  pricePeerTicket: number
  accumulated: number
  status: RaffleStatus
  visibility: RaffleVisibility
  createdAt: Date
  endsAt: Date
  
  winnerNumbers: WinnerNumber[]

  constructor (props: PublicRaffleProps){
    this.id = props.id
    this.shortId = props.shortId
    this.name = props.name,
    this.description = props.description
    this.image = props.image
    this.pricePeerTicket = props.pricePeerTicket
    this.accumulated = props.accumulated
    this.status = props.status
    this.visibility = props.visibility
    this.createdAt = props.createdAt
    this.endsAt = props.endsAt

    this.winnerNumbers = props.winnerNumbers ?? []
  }
}
  