import { Injectable } from '@nestjs/common';
import { PrismaClient} from '@prisma/client';
import { Model } from './shared.types';

@Injectable()
export class SharedRepository<T> {
    prismaClient: PrismaClient = new PrismaClient()

    transaction = async (callback: (prisma: PrismaClient) => Promise<any>) => {
        return await this.prismaClient.$transaction(callback)
    }

    create = async (model: Model, data: Record<string, any>): Promise<T> => {
        // @ts-ignore
        return <T>await this.prismaClient[model].create({data: data})
    }

    createMany = async (model: Model, data: Record<string, any>[]): Promise<{ count: number }> => {
        return await this.prismaClient[model].createMany({data: data})
    }

    findOne = async (model: Model, filters?: Record<string, any>, include?: Record<any, any>): Promise<T | null> => {
        // @ts-ignore
        return <T | null>await this.prismaClient[model].findFirst({where: filters, include: include})
    }

    findMany = async (model: Model, filters?: Record<string, any>, include?: Record<any, any>): Promise<T[]> => {
        // @ts-ignore
        return <T[]>await this.prismaClient[model].findMany({where: filters, include: include})
    }

    update = async (model: Model, data: Record<string, any>, filters: Record<string, any>, include?: Record<any, any>): Promise<T | null> => {
        // @ts-ignore
        return <T | null>await this.prismaClient[model].update({data: data, where: filters as any, include: include})
    }

    updateMany = async (model: Model, data: Record<string, any>, filters: Record<string, any>): Promise<T[]> => {
        // @ts-ignore
        return <T[]><any>await this.prismaClient[model].updateMany({data: data, where: filters})
    }

    delete = async (model: Model, filters: Record<string, any>): Promise<T | null> => {
        // @ts-ignore
        return <T | null>await this.prismaClient[model].delete({where: filters})
    }

    deleteMany = async (model: Model, filters: Record<string, any>): Promise<T[]> => {
        // @ts-ignore
        return <T[]><any>await this.prismaClient[model].deleteMany({where: filters})
    }
}