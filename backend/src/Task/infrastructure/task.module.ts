import { forwardRef, Module } from "@nestjs/common";
import { SharedModule } from "src/Shared/shared.module";
import { TaskService } from "../application/task.service";
import { TaskController } from "./task.controller";
import { TaskDispatcher } from "../application/task.dispatcher";
import { SubTaskService } from "../application/subtask.service";
import { TicketModule } from "src/Ticket/infrastructure/ticket.module";
import { SubTaskController } from "./subtask.controller";

@Module({
    imports: [
        SharedModule,
        TicketModule
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