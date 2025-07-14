import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from '../application/auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from 'src/User/infrastructure/user.module';
import { sharedConfig } from 'src/Shared/shared.config';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: sharedConfig.jwtSecret,
      signOptions: { expiresIn: sharedConfig.jwtExpiresIn },
    }),
  ],
  providers: [AuthService, JwtStrategy, JwtAuthGuard],
  controllers: [AuthController],
  exports: [JwtAuthGuard]
})
export class AuthModule {}

  