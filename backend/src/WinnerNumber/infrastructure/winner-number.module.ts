import { Module } from "@nestjs/common";
import { WinnerNumberService } from "../application/winner-number.service";
import { SharedModule } from "src/Shared/shared.module";

@Module({
    imports: [SharedModule],
    providers: [WinnerNumberService],
    exports: [WinnerNumberService]
})
export class WinnerNumberModule {}