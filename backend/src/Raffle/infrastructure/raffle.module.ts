import { Module } from "@nestjs/common";
import { SharedModule } from "../../Shared/shared.module";
import { RaffleService } from "../application/raffle.service";
import { RaffleController } from "./raffle.controller";
import { WinnerNumberModule } from "src/WinnerNumber/infrastructure/winner-number.module";
import { TaskModule } from "src/Task/infrastructure/task.module";

@Module({
    imports: [
        SharedModule, 
        TaskModule, 
        WinnerNumberModule
    ],
    providers: [RaffleService],
    controllers: [RaffleController],
    exports: [RaffleService]
})
export class RaffleModule {}