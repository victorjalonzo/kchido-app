import { Test, TestingModule } from "@nestjs/testing";
import { RaffleService } from "../application/raffle.service";
import { RaffleController } from "./raffle.controller";
import { SharedModule } from "../../Shared/shared.module";
import { CreateRaffleDTO } from "../application/create-raffle.dto";
import { Raffle, RaffleStatus } from "../domain/raffle.entity";

describe('RaffleModule', () => {
    let raffleService: RaffleService
    let raffleController: RaffleController

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [SharedModule],
            controllers: [RaffleController],
            providers: [RaffleService]
        }).compile()

        raffleService = await module.resolve(RaffleService)
        raffleController = await module.resolve(RaffleController)
    })

    describe('RaffleService', () => {
        let raffleId: string

        it('should create a raffle', async () => {
            const dto: CreateRaffleDTO = {
                name: 'raffle-test-1',
                description: 'raffle-description',
                image: './asset/raffles/raffle1.png',
                pricePeerTicket: 10,
                initialAmount: 10,
                status: RaffleStatus.ACTIVE,
                createdBy: '803e341a-0884-40ed-bcaa-5c9b5f604c4d',
                endsAt: new Date()
            }

            const raffle = await raffleService.create(dto)
            expect(raffle).toBeInstanceOf(Raffle)

            raffleId = raffle.id
        })

        it ('should retrieve a raffle', async () => {
            const record = await raffleService.findOne(raffleId)
            expect(record).toBeInstanceOf(Raffle)
        })

        it('should retrieve a list of raffle', async () => {
            const records = await raffleService.findMany()
            expect(Array.isArray(records)).toBe(true)
        })

        it ('it should delete a raffle', async () => {
            const record = await raffleService.delete(raffleId)
            expect(record).toBeInstanceOf(Raffle)
        })

    })
})