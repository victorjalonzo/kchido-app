import { Module } from "@nestjs/common";
import { SharedModule } from "src/Shared/shared.module";
import { TaskService } from "../application/task.service";
import { TaskController } from "./task.controller";
import { TaskDispatcher } from "../application/task.dispatcher";
import { SubTaskService } from "../application/subtask.service";
import { RaffleModule } from "src/Raffle/infrastructure/raffle.module";
import { TicketModule } from "src/Ticket/infrastructure/ticket.module";
import { SubTaskController } from "./subtask.controller";
import { OrderModule } from "src/Order/infrastructure/order.module";

@Module({
    imports: [
        SharedModule,
        RaffleModule,
        TicketModule,
        OrderModule
    ],
    providers: [
        TaskService, 
        TaskDispatcher,
        SubTaskService,
    ],
    controllers: [
        TaskController,
        SubTaskController
    ],
    exports: [TaskService]
})
export class TaskModule{}