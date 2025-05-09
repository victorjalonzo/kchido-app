import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../Database/prisma.service.js';
import { User } from '../domain/user.type.js';

@Injectable()
export class UserRepository {
    constructor(private prisma: PrismaService) {}

    async findOne(filters: Record<string, any>): Promise<User | null> {
        return <User><unknown>this.prisma.user.findFirst({ where: filters })
    }

    async findMany(filters?: Record<string, any>): Promise<User[]> {
        return <User[]><unknown>this.prisma.user.findMany({ where: filters })
    }
}