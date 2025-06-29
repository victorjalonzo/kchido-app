import { SharedRepository } from "src/Shared/shared.repository";
import { CreateTicketDTO } from "./create-ticket.dto";
import { Ticket } from "../domain/ticket.entity";
import { Model } from "src/Shared/shared.types";
import { TicketMapper } from "../infrastructure/ticket.mapper";
import { TicketNotFound } from "../domain/ticket.exception";
import { Injectable } from "@nestjs/common";
import { FindTicketFilter } from "./find-ticket-filter";
import { TicketJoinOption } from "./ticket-join-option";
import { TicketQRCode } from "../infrastructure/util/ticket.qrcode";
import * as fs from 'fs';
import { TicketShortIdGenerator } from "../infrastructure/util/ticket-shortId-generator";
import { 
    Orders as PrismaOrder, 
    PrismaClient, 
    Raffles as PrismaRaffle, 
    Tickets as PrismaTicket, 
    Users as PrismaUser 
} from "@prisma/client";

export interface IncludeTicketsRelationValues {
    user?: PrismaUser,
    raffle?: PrismaRaffle
    order?: PrismaOrder
}

interface Options {
    transaction?: PrismaClient
}

@Injectable()
export class TicketService {
    model: Model = Model.TICKETS

    constructor (private readonly repository: SharedRepository<PrismaTicket>){}

    create = async (dto: CreateTicketDTO): Promise<Ticket> => {
        const data = {...dto }

        data.shortId = TicketShortIdGenerator.generate()

        return await this.repository.create(this.model, data)
        .then(record => TicketMapper.toDomain(record))
    }

    createMany = async (dtos: CreateTicketDTO[], options: Options): Promise<{count: number}> => {
        const transaction = options?.transaction

        const tickets: Ticket[] = []

        for (const dto of dtos) {
            
            const data = {...dto}

            data.shortId = TicketShortIdGenerator.generate()
            const include = {raffle: true, order: true }

            const record = !transaction 
            ? await this.repository.create(this.model, data, include)
            : await transaction[this.model].create({ data, include })
            .then(async (record: (PrismaTicket & IncludeTicketsRelationValues)) => {
                const ticket = TicketMapper.toDomain(record)
                const receiptPath = await TicketQRCode.generate(ticket)

                return !transaction
                ? await this.repository.update(this.model, { receiptPath }, { id: record.id }, include)
                : await transaction[this.model].update({ where: { id: record.id }, data: { receiptPath }, include})
            })

            const ticket = TicketMapper.toDomain(record)
            tickets.push(ticket)
        }

        return { count: tickets.length };
    }

    async getTicketReceiptFile(id: string): Promise<string> {
        const ticket = await this._find({ id }, { keepRawRecord: true })
        const receiptPath = ticket.receiptPath

        if (!receiptPath) throw Error('No receipt path found.')

        if (!fs.existsSync(receiptPath)) {
          throw new Error('Receipt file missing.');
        }
    
        return receiptPath;
      }

    findByOrder = async (orderId: string) => {
        return await this._findMany({ orderId })
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
        .then((records: (PrismaTicket & IncludeTicketsRelationValues)[]) => 
            records.map(record => TicketMapper.toDomain(record))
        )
    }

    _find = async (filters?: Record<string, any>, options?: { keepRawRecord: boolean }): Promise<Ticket | PrismaTicket> => {
        const keepRawRecord = options?.keepRawRecord
        
        return await this.repository.findOne(this.model, filters)
        .then( record => {
            if (!record) throw new TicketNotFound()
            return keepRawRecord ? record : TicketMapper.toDomain(record)
        })
    }
}