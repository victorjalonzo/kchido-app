import { SharedRepository } from "../../Shared/shared.repository";
import { Model } from "../../Shared/shared.types";
import { RaffleNotFoundException } from "../domain/raffle.exceptions";
import { Raffle, RaffleVisibility } from "../domain/raffle.entity";
import { RaffleMapper } from "../infrastructure/raffle.mapper";
import { CreateRaffleDTO } from "./create-raffle.dto";
import { Injectable } from "@nestjs/common";
import { RaffleStatus } from "../domain/raffle.entity";
import { WinnerNumberService } from "src/WinnerNumber/application/winner-number.service";
import { CreateWinnerNumberDTO } from "src/WinnerNumber/application/create-winner-number.dto";
import { WinnerNumber } from "src/WinnerNumber/domain/winner-number.entity";
import { UpdateRaffleDTO } from "./update-raffle.dto";
import * as fs from 'fs'
import { 
    PrismaClient,
    Orders as PrismaOrder, 
    Raffles as PrismaRaffle, 
    Tickets as PrismaTicket, 
    Users as PrismaUser,
} from "@prisma/client";
import { RaffleShortIdGenerator } from "../infrastructure/util/raffle-shortId-generator";
import { RaffleImageUploader } from "../infrastructure/util/raffle-image-uploader";
import { sharedConfig } from "src/Shared/shared.config";
import { CreateTaskDto } from "src/Task/application/create-task.dto";
import { TaskStatus, TaskType } from "src/Task/domain/task.entity";
import { TaskService } from "src/Task/application/task.service";

export interface FindRaffleFilters {
    id?: string
    creatorId?: string
    visibility?: RaffleVisibility,
    status?: RaffleStatus
}

export interface RaffleIncludeOptions {
    creator?: boolean
    participants?: boolean
    orders?: boolean
    tickets?: boolean
    winnerNumbers?: boolean
}

export interface RaffleIncludeValues {
    creator?: PrismaUser
    participants?: PrismaUser[]
    orders?: PrismaOrder[]
    tickets?: PrismaTicket[]
    winnerNumbers?: WinnerNumber[]
}


@Injectable()
export class RaffleService {
    model: Model = Model.RAFFLES

    constructor(
        private readonly repository: SharedRepository<PrismaRaffle>,
        private readonly taskService: TaskService, 
        private readonly winnerNumberService: WinnerNumberService,
    ) {}

    addParticipant = async (raffleId: string, userId: string, options: {transaction: PrismaClient}) => {
        const transaction = options.transaction
        return await transaction.raffles.update({
            where: {id: raffleId},
            data: {participants: {connect: {id: userId}}}
        })
    }

    create = async (dto: CreateRaffleDTO): Promise<Raffle> => {
        if (typeof dto.endsAt == 'string') dto.endsAt = new Date(dto.endsAt)
        dto.shortId = RaffleShortIdGenerator.generate()
        
        const {image, ...data} = dto

        return await this.repository.create(this.model, data)
        .then(async (record) => {
            return image
            ? await this.update({id: record.id, image, ...data})
            : RaffleMapper.toDomain(record)
        })
    }

    update = async (dto: UpdateRaffleDTO): Promise<Raffle> => {
        if (typeof dto.endsAt == 'string') dto.endsAt = new Date(dto.endsAt)

        if (dto?.status == RaffleStatus.ENDED) return await this.finalize(dto)
        if (dto.image) dto.image = RaffleImageUploader.save(dto.id, dto.image)

        return await this.repository.update(this.model, dto, {id: dto.id})
        .then(async record => {
            if (!record) throw new RaffleNotFoundException()
            return RaffleMapper.toDomain(record)
        })
    }

    finalize = async (dto: UpdateRaffleDTO): Promise<Raffle> => {
        const {winnerNumbers, ...data} = dto

        if (!winnerNumbers) throw new Error('Winner numbers empty')

        const record = await this.repository.transaction(async (tx) => {
            const record = tx[this.model].update({ 
                where: {id: dto.id}, 
                data: {status: RaffleStatus.ENDED, ...data} 
            })

            const winnerNumberDtos: CreateWinnerNumberDTO[] = winnerNumbers.map(number => (
                { raffleId: dto.id, serial: number}
            ))
            await this.winnerNumberService.createMany(winnerNumberDtos, { transaction: tx })

            return record;
        })

        const createTaskDto: CreateTaskDto = {
            type: TaskType.RAFFLE_ENDED,
            raffleId: record.id,
            status: TaskStatus.DELIVERING
        }

        await this.taskService.create(createTaskDto).catch(_ => null) 

        return await this._findOne({ id: record.id }, { winnerNumbers: true })
    }

    findPublicOne = async (id: string, includes?: RaffleIncludeOptions) => {
        return await this.repository.findOne(this.model, {
            id: id, 
            visibility: RaffleVisibility.PUBLIC,
        }, includes)
        .then(record => {
            if (!record) throw new RaffleNotFoundException()
            return RaffleMapper.toPublicDomain(record)
        })
    }

    findPublicMany = async (includes?: RaffleIncludeOptions) => {
        return await this.repository.findMany(this.model, 
            { visibility: RaffleVisibility.PUBLIC},
            includes
        )
        .then(records => records.map(
            record => RaffleMapper.toPublicDomain(record)
        ))
    }

    findById = async (id: string, includes?: RaffleIncludeOptions): Promise<Raffle> => {
        return await this._findOne({ id }, includes)
    }

    findMany = async (filters?: FindRaffleFilters, includes?: RaffleIncludeOptions): Promise<Raffle[]> => {
        return await this._findMany(filters, includes)
    }

    deleteById = async (id: string): Promise<Raffle> => {
        return await this.repository.delete(this.model, { id })
        .then(record => {
            if (!record) throw new RaffleNotFoundException()
            return RaffleMapper.toDomain(record)
        })
    }

    getRaffleImage = async (id: string): Promise<string> => {
        try {
            const raffle = await this._findOne({ id }, {}, { keepRawRecord: true })
            const imagePath = raffle.image
    
            if (!imagePath) throw Error('No Raffle Image path found.')
    
            if (!fs.existsSync(imagePath)) {
              throw new Error('Raffle image file missing.');
            }
    
            return imagePath;
        }
        catch(e) {
            const apiURL = sharedConfig.appApiURL
            const staticEndpoint = `${apiURL}/static/default/raffle-image.png`
            return staticEndpoint;
        }
    }

    incrementAccumulated = async (id: string, increment: number, options?: { transaction: PrismaClient }) => {
        const raffle = await this._findOne({ id })
        const accumulated = raffle.accumulated + increment
        const transaction = options?.transaction

        if (transaction) {
            const record = await transaction[this.model].update({
                data: { accumulated },
                where: { id: raffle.id }
            })

            return RaffleMapper.toDomain(record)
        }
        else {
            return await this._updateOne({ id }, {accumulated })
        }
    }

    _updateOne = async (filters: FindRaffleFilters, data: Record<string, any>) => {
        return await this.repository.update(this.model, data, filters)
        .then(record => {
            if (!record) throw new RaffleNotFoundException()
            return RaffleMapper.toDomain(record)
        })
    }

    _findOne = async (filters?: FindRaffleFilters, includes?: RaffleIncludeOptions, options?: {keepRawRecord?: boolean}): Promise<Raffle> => {
        return await this.repository.findOne(this.model, filters, includes)
        .then((record: (PrismaRaffle & RaffleIncludeValues)) => {
            if (!record) throw new RaffleNotFoundException()

            return !options?.keepRawRecord
                ? RaffleMapper.toDomain(record)
                : record
        })
    }

    _findMany = async (filters?: FindRaffleFilters, includes?: RaffleIncludeOptions): Promise<Raffle[]> => {
        return await this.repository.findMany(this.model, filters, includes)
        .then((records: (PrismaRaffle & RaffleIncludeValues)[]) => {
            return records.map(record => {
                return RaffleMapper.toDomain(record)
            })
        })
    } 
}