import { WinnerNumber } from "../domain/winner-number.entity"
import { RaffleWinnerNumbers } from "@prisma/client"

export class WinnerNumberMapper {
    static toDomain = (raw: RaffleWinnerNumbers) => {
        return new WinnerNumber({...raw})
    }
}