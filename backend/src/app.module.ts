import { Module } from '@nestjs/common';
import { UserModule } from './User/infrastructure/user.module.js';
import { PrismaModule } from './Database/prisma.module.js';

@Module({
  imports: [UserModule, PrismaModule],
})
export class AppModule {}
