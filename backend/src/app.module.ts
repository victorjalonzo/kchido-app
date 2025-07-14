import { Module } from '@nestjs/common';
import { UserModule } from './User/infrastructure/user.module';
import { SharedModule } from './Shared/shared.module';
import { RaffleModule } from './Raffle/infrastructure/raffle.module';
import { PermissionModule } from './Permission/infrastructure/permission.module';
import { AuthModule } from './Auth/infrastructure/auth.module';
import { TicketModule } from './Ticket/infrastructure/ticket.module';
import { OrderModule } from './Order/infrastructure/order.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AppController } from './app.controller';
import { PaymentModule } from './Payment/infrastructure/payment.module';
import { TaskModule } from './Task/infrastructure/task.module';
import { ChatbotConfigurationModule } from './ChatbotConfiguration/infrastructure/chatbot-configuration.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: './public',
      serveRoot: '/api/v1/static',
    }),
    SharedModule, 
    UserModule,
    PermissionModule,
    RaffleModule,
    AuthModule,
    OrderModule,
    TicketModule,
    PaymentModule,
    TaskModule,
    ChatbotConfigurationModule
  ],
  controllers: [AppController]
})
export class AppModule {}