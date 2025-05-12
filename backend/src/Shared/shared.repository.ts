import { Injectable } from '@nestjs/common';
import { PrismaClient} from '@prisma/client';
import { Model } from './shared.types';


@Injectable()
export class SharedRepository<T> {
    prismClient: PrismaClient = new PrismaClient()

    create = async (model: Model, data: Record<string, any>): Promise<T> => {
        // @ts-ignore
        return <T>await this.prismClient[model].create({data: data})
    }

    findOne = async (model: Model, filters: Record<string, any>): Promise<T | null> => {
        // @ts-ignore
        return <T | null>await this.prismClient[model].findFirst({where: filters})
    }

    findMany = async (model: Model, filters?: Record<string, any>): Promise<T[]> => {
        // @ts-ignore
        return <T[]>await this.prismClient[model].findMany({where: filters})
    }

    update = async (model: Model, data: Record<string, any>, filters: Record<string, any>): Promise<T | null> => {
        // @ts-ignore
        return <T | null>await this.prismClient[model].update({data: data, where: filters as any})
    }

    updateMany = async (model: Model, data: Record<string, any>, filters: Record<string, any>): Promise<T[]> => {
        // @ts-ignore
        return <T[]><any>await this.prismClient[model].updateMany({data: data, where: filters})
    }

    delete = async (model: Model, filters: Record<string, any>): Promise<T | null> => {
        // @ts-ignore
        return <T | null>await this.prismClient[model].delete({where: filters})
    }

    deleteMany = async (model: Model, filters: Record<string, any>): Promise<T[]> => {
        // @ts-ignore
        return <T[]><any>await this.prismClient[model].deleteMany({where: filters})
    }
}