import { SharedRepository } from "../../Shared/shared.repository";
import { Model } from "../../Shared/shared.types";
import { RaffleNotFoundException } from "../domain/raffle.exceptions";
import { Raffle } from "../domain/raffle.entity";
import { RaffleMapper } from "../infrastructure/raffle.mapper";
import { CreateRaffleDTO } from "./create-raffle.dto";
import { Injectable } from "@nestjs/common";
import { RaffleStatus } from "../domain/raffle.entity";
import { WinnerNumberService } from "src/WinnerNumber/application/winner-number.service";
import { CreateWinnerNumberDTO } from "src/WinnerNumber/application/create-winner-number.dto";
import { WinnerNumber } from "src/WinnerNumber/domain/winner-number.entity";
import { UpdateRaffleDTO } from "./update-raffle.dto";

@Injectable()
export class RaffleService {
    model: Model = Model.RAFFLES

    constructor(
        private readonly repository: SharedRepository<Raffle>,
        private readonly winnerNumberService: WinnerNumberService
    ) {}

    create = async (dto: CreateRaffleDTO): Promise<Raffle> => {
        if (typeof dto.endsAt == 'string') dto.endsAt = new Date(dto.endsAt)

        return await this.repository.create(this.model, dto)
        .then(record => RaffleMapper.toDomain(record))
    }

    update = async (dto: UpdateRaffleDTO): Promise<Raffle> => {
        if (typeof dto.endsAt == 'string') dto.endsAt = new Date(dto.endsAt)

        const {winnerNumbers, ...updateDTO} = dto

        return await this.repository.update(this.model, updateDTO, {id: dto.id})
        .then(async record => {
            if (!record) throw new RaffleNotFoundException()
            const raffle = RaffleMapper.toDomain(record)
            const winnerNumberList: WinnerNumber[] = []

            if (winnerNumbers) {
                for (const number of winnerNumbers) {
                    const winnerNumberDTO: CreateWinnerNumberDTO = {
                        serial: number,
                        raffleId: raffle.id
                    }

                    await this.winnerNumberService.create(winnerNumberDTO)
                    .then(winnerNumber => winnerNumberList.push(winnerNumber))
                }
            }
            raffle.winnerNumbers = winnerNumberList

            return raffle
        })
    }

    findPublicOne = async (id: string) => {
        return await this._findOne({ id, status: RaffleStatus.ONGOING})
    }

    findPublicMany = async () => {
        return await this._findMany({ status: RaffleStatus.ONGOING})
    }

    findOne = async (id: string): Promise<Raffle> => {
        return await this._findOne({ id })
    }

    findMany = async (): Promise<Raffle[]> => {
        return await this._findMany()
    }

    deleteById = async (id: string): Promise<Raffle> => {
        return await this.repository.delete(this.model, { id })
        .then(record => {
            if (!record) throw new RaffleNotFoundException()
            return RaffleMapper.toDomain(record)
        })
    }

    _findOne = async (filters: Record<string, any>): Promise<Raffle> => {
        return await this.repository.findOne(this.model, filters)
        .then(record => {
            if (!record) throw new RaffleNotFoundException()
            return RaffleMapper.toDomain(record)
        })
    }

    _findMany = async (filters?: Record<string, any>): Promise<Raffle[]> => {
        return await this.repository.findMany(this.model, filters, {winnerNumbers: true})
        .then(records => {
            return records.map(record => {
                return RaffleMapper.toDomain(record)
            })
        })
    } 
}