import { Tickets } from "@prisma/client";
import { SharedRepository } from "src/Shared/shared.repository";
import { CreateTicketDTO } from "./create-ticket.dto";
import { Ticket } from "../domain/ticket.entity";
import { Model } from "src/Shared/shared.types";
import { TicketMapper } from "../infrastructure/ticket.mapper";
import { TicketNotFound } from "../domain/ticket.exception";
import { Injectable } from "@nestjs/common";
import { FindTicketFilter } from "./find-ticket-filter";
import { TicketJoinOption } from "./ticket-join-option";


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

    findMany = async (filters?: FindTicketFilter, include?: TicketJoinOption): Promise<Ticket[]> => {
        return await this._findMany(filters, include)
    }


    delete = async(id: string) => {
        return await this.repository.delete(this.model, { id })
        .then(record => {
            if (!record) throw new TicketNotFound()
            return TicketMapper.toDomain(record)
        })
    }

    _findMany = async (filters?: FindTicketFilter, include?: TicketJoinOption): Promise<Ticket[]> => {
        return await this.repository.findMany(this.model, filters, include)
        .then( records => records.map(record => TicketMapper.toDomain(record)))
    }

    _find = async (filters: Record<string, any>): Promise<Ticket> => {
        return await this.repository.findOne(this.model, filters)
        .then( record => {
            if (!record) throw new TicketNotFound()
            return TicketMapper.toDomain(record)
        })
    }
}