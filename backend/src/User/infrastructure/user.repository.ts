import { Injectable } from '@nestjs/common';
import { Repository } from '../../Shared/domain/repository.type.js';
import { PrismaService } from '../../Database/prisma.service.js';
import { User } from '../domain/user.type.js';

@Injectable()
export class UserRepository implements Repository<User> {
    constructor(private prisma: PrismaService) {}

    async get(filters: Record<string, any>): Promise<User | null> {
        return <User><unknown>this.prisma.user.findFirst({ where: filters })
    }
}