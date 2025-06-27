import { Test, TestingModule } from "@nestjs/testing";
import { WinnerNumberService } from "../application/winner-number.service";
import { SharedModule } from "src/Shared/shared.module";
import { CreateWinnerNumberDTO } from "../application/create-winner-number.dto";
import { WinnerNumber } from "../domain/winner-number.entity";

describe('WinnerNumberModule', () => {
    let service: WinnerNumberService

    beforeEach(async () => {
        const module = <TestingModule>await Test.createTestingModule({
            imports: [SharedModule],
            providers: [WinnerNumberService],
            exports: [WinnerNumberService]
        }).compile()

        service = module.get(WinnerNumberService)
    })

    it('should create a winner number', async () => {
        const raffleId = "5533d528-35e8-474f-8bda-da28520ad6fb"

        const dto: CreateWinnerNumberDTO = {
            raffleId: raffleId,
            serial: "8888"
        }

        await service.create(dto)
        .then(winnerNumber => {
            expect(winnerNumber).toBeInstanceOf(WinnerNumber)
        })
        
    })
})