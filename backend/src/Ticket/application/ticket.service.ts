import { Tickets } from "@prisma/client";
import { SharedRepository } from "src/Shared/shared.repository";
import { CreateTicketDTO } from "./create-ticket.dto";
import { Ticket } from "../domain/ticket.entity";
import { Model } from "src/Shared/shared.types";
import { TicketMapper } from "../infrastructure/ticket.mapper";
import { TicketNotFound } from "../domain/ticket.exception";
import { Injectable } from "@nestjs/common";

@Injectable()
export class TicketService {
    model: Model = Model.TICKETS

    constructor (private readonly repository: SharedRepository<Tickets>){}

    create = async (dto: CreateTicketDTO): Promise<Ticket> => {
        return await this.repository.create(this.model, dto)
        .then(record => TicketMapper.toDomain(record))
    }

    findOne = async(id: string) => {
        return await this.repository.findOne(this.model, { id })
        .then(record => {
            if (!record) throw new TicketNotFound()
            return TicketMapper.toDomain(record)
        })
    }

    findMany = async (raffleId?: string) => {
        return await this.repository.findMany(this.model, { raffleId })
        .then(records => {
            return records.map((record) => TicketMapper.toDomain(record))
        })
    }

    delete = async(id: string) => {
        return await this.repository.delete(this.model, { id })
        .then(record => {
            if (!record) throw new TicketNotFound()
            return TicketMapper.toDomain(record)
        })
    }

}