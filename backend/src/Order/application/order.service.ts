import { Injectable } from "@nestjs/common";
import { Orders } from "@prisma/client";
import { SharedRepository } from "src/Shared/shared.repository";
import { Model } from "src/Shared/shared.types";
import { CreateOrderDTO } from "./create-order.dto";
import { Order, OrderStatus } from "../domain/order.entity";
import { OrderMapper } from "../infrastructure/order.mapper";

@Injectable()
export class OrderService {
    model: Model = Model.ORDERS

    constructor (
        private readonly repository: SharedRepository<Orders>
    ) {}

    create = async (dto: CreateOrderDTO): Promise<Order> => {
        const data: {status: OrderStatus} & CreateOrderDTO = {status: OrderStatus.PENDING, ...dto}

        return await this.repository.create(this.model, data)
        .then(record => OrderMapper.toDomain(record))
    } 

    find = async (id: string) => {}
    findMany = async () => {}
    findByUser = async (userId: string) => {}
    findByRaffle = async (raffleId: string) => {}
}