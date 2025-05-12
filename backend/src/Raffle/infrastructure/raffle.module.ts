import { Module } from "@nestjs/common";
import { SharedModule } from "../../Shared/shared.module";
import { RaffleService } from "../application/raffle.service";
import { RaffleController } from "./raffle.controller";

@Module({
    imports: [SharedModule],
    providers: [RaffleService],
    controllers: [RaffleController]
})
export class RaffleModule {}