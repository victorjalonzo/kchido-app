import { Raffles } from "@prisma/client"
import { Raffle, RaffleStatus } from "../domain/raffle.entity"

export class RaffleMapper {
    static toDomain = (raw: Raffles)  => {
        const status = raw.status as RaffleStatus
 
        return new Raffle({
            ...raw,
            status,
        })
    }
}