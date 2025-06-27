import { Injectable } from "@nestjs/common";
import { PrismaClient, TicketReservations } from "@prisma/client";
import { SharedRepository } from "src/Shared/shared.repository";
import { CreateTicketReservationDTO } from "./create-ticket-reservation.dto";
import { Model } from "src/Shared/shared.types";

interface Options {
    transaction?: PrismaClient
}

@Injectable()
export class TicketReservationService {
    model: Model = Model.TICKET_RESERVATIONS
    
    constructor (private readonly repository: SharedRepository<TicketReservations>) {}

    createMany = async (dtos: CreateTicketReservationDTO[], options?: Options): Promise<{ count: number}> => {
        const transaction = options?.transaction ?? null

        const now = new Date();
        const tomorrow = new Date(now);

        tomorrow.setHours(now.getHours() + 24);

        const data = dtos.map(dto => {
            return {
                ...dto,
                serial: String(dto.serial),
                expiresAt: tomorrow, 
            }
        })

        if (!transaction) return await this.repository.createMany(this.model, data)
        return await transaction[this.model].createMany({data: data})
    }
}