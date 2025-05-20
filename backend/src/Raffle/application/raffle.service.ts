import { SharedRepository } from "../../Shared/shared.repository";
import { Model } from "../../Shared/shared.types";
import { RaffleNotFoundException } from "../domain/raffle.exceptions";
import { Raffle } from "../domain/raffle.entity";
import { RaffleMapper } from "../infrastructure/raffle.mapper";
import { CreateRaffleDTO } from "./create-raffle.dto";
import { Injectable } from "@nestjs/common";
import { RaffleStatus } from "../domain/raffle.entity";

@Injectable()
export class RaffleService {
    model: Model = Model.RAFFLES

    constructor(private readonly repository: SharedRepository<Raffle>) {}

    create = async (dto: CreateRaffleDTO): Promise<Raffle> => {
        return await this.repository.create(this.model, dto)
        .then(record => RaffleMapper.toDomain(record))
    }

    findPublicOne = async (id: string) => {
        return await this._findOne({ id, status: RaffleStatus.PUBLIC})
    }

    findPublicMany = async () => {
        return await this._findMany({ status: RaffleStatus.PUBLIC})
    }

    findOne = async (id: string): Promise<Raffle> => {
        return await this._findOne({ id })
    }

    findMany = async (): Promise<Raffle[]> => {
        return await this._findMany()
    }

    delete = async (id: string): Promise<Raffle> => {
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
        return await this.repository.findMany(this.model, filters)
        .then(records => {
            return records.map(record => {
                return RaffleMapper.toDomain(record)
            })
        })
    } 
}