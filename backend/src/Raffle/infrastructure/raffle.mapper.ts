import { Raffles } from "@prisma/client"
import { Raffle, RaffleStatus, RaffleVisibility } from "../domain/raffle.entity"

export class RaffleMapper {
    static toDomain = (raw: Raffles)  => {
        const status = raw.status as RaffleStatus
        const visibility = raw.visibility as RaffleVisibility
 
        return new Raffle({
            ...raw,
            status,
            visibility
        })
    }
}