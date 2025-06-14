import { Injectable } from "@nestjs/common";
import { Orders, Prisma, PrismaClient, Raffles, TicketReservations, Tickets, Users } from "@prisma/client";
import { SharedRepository } from "src/Shared/shared.repository";
import { Model } from "src/Shared/shared.types";
import { CreateOrderDTO } from "./create-order.dto";
import { Order, OrderStatus } from "../domain/order.entity";
import { OrderMapper } from "../infrastructure/order.mapper";
import { OrderNotFound, OrderStatusAlreadySet } from "../domain/order.exception";
import { UpdateOrderDTO } from "./update-order.dto";
import { IncludeOrderQuery } from "./include-order.query";
import { FindOrderQuery } from "./find-order.query";
import { TicketService } from "src/Ticket/application/ticket.service";
import { CreateTicketDTO } from "src/Ticket/application/create-ticket.dto";
import { TicketReservationService } from "src/TicketReservation/application/ticket-reservation.service";
import { CreateTicketReservationDTO } from "src/TicketReservation/application/create-ticket-reservation.dto";
import { RaffleService } from "src/Raffle/application/raffle.service";
import { Raffle } from "src/Raffle/domain/raffle.entity";
import { TicketReservationNotFound } from "src/TicketReservation/domain/ticket-reservation.exception";

export interface IncludeOrdersRelationValues {
    user?: Users,
    raffle?: Raffles
    tickets?: Tickets[]
    ticketReservations?: TicketReservations[]
}

@Injectable()
export class OrderService {
    model: Model = Model.ORDERS

    constructor (
        private readonly repository: SharedRepository<Orders>,
        private readonly raffleService: RaffleService,
        private readonly ticketService: TicketService,
        private readonly ticketReservationService: TicketReservationService
    ) {}

    create = async (dto: CreateOrderDTO): Promise<Order> => {
        const { tickets, ...data } = dto

        if (!data.status) data.status = OrderStatus.PENDING

        const raffle = await this.raffleService.findById(dto.raffleId)
        const pricePeerTicket = raffle.pricePeerTicket

        data.quantity = dto.tickets.length
        data.total = pricePeerTicket * dto.tickets.length

        const record = await this.repository.transaction(async (tx) => {
            return await tx[this.model].create({ data })
            .then(async (record: Orders) => {
                if (record.status == OrderStatus.COMPLETED){
                    const ticketDtos: CreateTicketDTO[] = tickets.map(serial => {
                        const ticketDto: CreateTicketDTO = {
                            serial: serial,
                            raffleId: dto.raffleId,
                            userId: dto.userId,
                            orderId: record.id,
                            price: pricePeerTicket
                        }
                        return ticketDto
                    })

                    await this.ticketService
                        .createMany(ticketDtos, { 
                            transaction: tx 
                        })

                    await this.raffleService
                        .incrementAccumulated(record.raffleId, record.total, { 
                            transaction: tx
                        })
                }
                else {
                    const ticketReservationDtos: CreateTicketReservationDTO[] = tickets.map(serial => {
                        const ticketReservationDto: CreateTicketReservationDTO = {
                            orderId: record.id,
                            userId: record.userId,
                            raffleId: record.raffleId,
                            serial: serial
                        }
                        return ticketReservationDto
                    })
    
                    await this.ticketReservationService
                        .createMany(ticketReservationDtos, {
                            transaction: tx
                        })
                }

                return record; 
            })
        })

        return await this.findById(record.id, { 
            tickets: true, 
            ticketReservations: true
        })
    }

    complete = async (id: string) => {
        const order = await this._find({ id }, {ticketReservations: true, raffle: true})
        .then(async order => {
            if (!order.isPending()) throw new OrderStatusAlreadySet(order)

            const raffle = <Raffle>order.raffle
    
            if (!order.ticketReservations) throw new TicketReservationNotFound()
    
            const createTicketDtos = order.ticketReservations.map((reservation) => {
                const ticketDto: CreateTicketDTO = {
                    serial: reservation.serial,
                    raffleId: order.raffleId,
                    userId: order.userId,
                    orderId: order.id,
                    price: raffle.pricePeerTicket
                }
                return ticketDto
            })
    
            await this.repository.transaction(async (tx) => {
                await tx[this.model].update({where: {id: order.id}, data: {
                    status: OrderStatus.COMPLETED,
                    purchasedAt: new Date()
                }})
    
                await this.ticketService.createMany(createTicketDtos, {transaction: tx})
            })

            return order;
        })

        return await this.findById(order.id, { tickets: true })
    }

    update = async (dto: UpdateOrderDTO): Promise<Order> => {
        const {id, ...data} = dto

        return await this.repository.update(this.model, data, { id })
        .then(record => {
            if (!record) throw new OrderNotFound()
            return OrderMapper.toDomain((record as Orders & IncludeOrdersRelationValues))
        })
    }

    findById = async (id: string, include?: IncludeOrderQuery) => {
        return await this._find( { id }, include)
    }

    findMany = async (filters?: FindOrderQuery, include?: IncludeOrderQuery) => {
        return await this._findMany(filters, include)
    }

    delete = async (id: string) => {
        return await this.repository.delete(this.model, { id })
    }

    _find = async (filters?: Record<string, any>, include?: IncludeOrderQuery): Promise<Order> => {
        const record = <(Orders & IncludeOrdersRelationValues) | null> await this.repository.findOne(this.model, filters, include)
        if (!record) throw new OrderNotFound()
        const order = OrderMapper.toDomain(record)

        return order;
    }
    
    _findMany = async (filters?: Record<string, any>, include?: IncludeOrderQuery): Promise<Order[]> => {
        const records = <(Orders & IncludeOrdersRelationValues)[]>await this.repository.findMany(this.model, filters, include)
        const orders = records.map(record => OrderMapper.toDomain(record))
        
        return orders; 
    }

}