import { Injectable } from "@nestjs/common"
import { SharedRepository } from "src/Shared/shared.repository"
import { Model } from "src/Shared/shared.types"
import { CreateWinnerNumberDTO } from "./create-winner-number.dto"
import { WinnerNumberMapper } from "../infrastructure/winner-number.mapper"
import { PrismaClient, RaffleWinnerNumbers } from "@prisma/client"
import { WinnerNumber } from "../domain/winner-number.entity"

@Injectable()
export class WinnerNumberService {
    model: Model = Model.WINNER_NUMBERS

    constructor (private readonly repository: SharedRepository<RaffleWinnerNumbers>) {}

    createMany = async (dtos: CreateWinnerNumberDTO[], options: { transaction: PrismaClient}) => {
        return await options.transaction[this.model].createMany({ data: dtos})
    }

    create = async (dto: CreateWinnerNumberDTO): Promise<WinnerNumber> => {
        return await this.repository.create(this.model, dto)
        .then(record => WinnerNumberMapper.toDomain(record))
    }

    findManyByRaffle = async (raffleId: string): Promise<WinnerNumber[]> => {
        return await this.repository.findMany(this.model, { raffleId })
        .then(records => records.map(
            record => WinnerNumberMapper.toDomain(record)
        ))
    }
}