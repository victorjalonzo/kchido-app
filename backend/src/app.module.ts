import { Module } from '@nestjs/common';
import { UserModule } from './User/infrastructure/user.module';
import { SharedModule } from './Shared/shared.module';
import { RaffleModule } from './Raffle/infrastructure/raffle.module';
import { PermissionModule } from './Permission/infrastructure/permission.module';
import { AuthModule } from './Auth/infrastructure/auth.module';

@Module({
  imports: [
    SharedModule, 
    UserModule,
    PermissionModule,
    RaffleModule,
    AuthModule
  ],
})
export class AppModule {}
