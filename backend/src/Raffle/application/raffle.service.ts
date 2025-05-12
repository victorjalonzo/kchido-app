import { SharedRepository } from "../../Shared/shared.repository";
import { Model } from "../../Shared/shared.types";
import { RaffleNotFoundException } from "../domain/raffle.exceptions";
import { Raffle } from "../domain/raffle.entity";
import { RaffleMapper } from "../infrastructure/raffle.mapper";
import { CreateRaffleDTO } from "./create-raffle.dto";
import { Injectable } from "@nestjs/common";

@Injectable()
export class RaffleService {
    model: Model = Model.RAFFLES

    constructor(private readonly repository: SharedRepository<Raffle>) {}

    create = async (dto: CreateRaffleDTO): Promise<Raffle> => {
        return await this.repository.create(this.model, dto)
        .then(record => RaffleMapper.toDomain(record))
    }

    findOne = async (id: string): Promise<Raffle> => {
        return await this.repository.findOne(this.model, { id })
        .then(record => {
            if (!record) throw new RaffleNotFoundException()
            return RaffleMapper.toDomain(record)
        })
    }

    findMany = async (): Promise<Raffle[]> => {
        return await this.repository.findMany(this.model)
        .then(records => {
            return records.map(record => {
                return RaffleMapper.toDomain(record)
            })
        })
    }

    delete = async (id: string): Promise<Raffle> => {
        return await this.repository.delete(this.model, { id })
        .then(record => {
            if (!record) throw new RaffleNotFoundException()
            return RaffleMapper.toDomain(record)
        })
    }
}