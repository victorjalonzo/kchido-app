import { Test, TestingModule } from "@nestjs/testing";
import { RaffleModule } from "src/Raffle/infrastructure/raffle.module";
import { SharedModule } from "src/Shared/shared.module";
import { SubTaskService } from "src/Task/application/subtask.service";
import { TaskDispatcher } from "src/Task/application/task.dispatcher";
import { TaskService } from "src/Task/application/task.service";
import { TicketModule } from "src/Ticket/infrastructure/ticket.module";
import { TaskController } from "../task.controller";
import { OrderModule } from "src/Order/infrastructure/order.module";


export async function createTaskTestingModule(): Promise<TestingModule> {
  return Test.createTestingModule({
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
    controllers: [TaskController],
    exports: [TaskService]
  }).compile()
}
