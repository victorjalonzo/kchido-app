import { Test, TestingModule } from "@nestjs/testing";
import { RaffleService } from "../application/raffle.service";
import { RaffleController } from "./raffle.controller";
import { SharedModule } from "../../Shared/shared.module";
import { CreateRaffleDTO } from "../application/create-raffle.dto";
import { Raffle, RaffleStatus } from "../domain/raffle.entity";
import { IsArray } from "class-validator";

let raffleService: RaffleService
let raffleController: RaffleController

describe('RaffleModule', () => {

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [SharedModule],
            controllers: [RaffleController],
            providers: [RaffleService]
        }).compile()

        raffleService = await module.resolve(RaffleService)
        raffleController = await module.resolve(RaffleController)
    })

    const mocks: CreateRaffleDTO[] = [
        {
            name: "Sorteo Nacional",
            endsAt: new Date("2025-05-17T18:00:00"),
            status: RaffleStatus.ONGOING,
            initialAmount: 4500,
            pricePeerTicket: 5,
            createdBy: 'f94f7d7c-b2c6-4d33-a777-b907f063a881'
        },
        {
            name: "Lotería Especial",
            endsAt: new Date("2025-05-17T18:00:00"),
            status: RaffleStatus.ONGOING,
            initialAmount: 6000,
            pricePeerTicket: 5,
            createdBy: 'f94f7d7c-b2c6-4d33-a777-b907f063a881'
        },
        {
            name: "Gran Sorteo Mensual",
            endsAt: new Date("2025-05-17T18:00:00"),
            status: RaffleStatus.ONGOING,
            initialAmount: 5700,
            pricePeerTicket: 5,
            createdBy: 'f94f7d7c-b2c6-4d33-a777-b907f063a881'
        },
        {
            name: "Sorteo Extraordinario",
            endsAt: new Date("2025-05-17T18:00:00"),
            status: RaffleStatus.ONGOING,
            initialAmount: 3200,
            pricePeerTicket: 5,
            createdBy: 'f94f7d7c-b2c6-4d33-a777-b907f063a881'
        },
        {
            name: "Sorteo Semanal",
            endsAt: new Date("2025-05-17T18:00:00"),
            status: RaffleStatus.ONGOING,
            initialAmount: 7800,
            pricePeerTicket: 5,
            createdBy: 'f94f7d7c-b2c6-4d33-a777-b907f063a881'
        },
    ]

    it('should create mocks data', async () => {
        const result: Raffle[] = []

        for (const mock of mocks) {
            const raffle = await raffleService.create(mock)
            result.push(raffle)
        }

        console.log(result)

        expect(Array.isArray(result)).toBeTruthy()
    })

    
    /*
    describe('RaffleService', () => {
        let raffleId: string

        it('should create a raffle', async () => {
            const dto: CreateRaffleDTO = {
                name: 'raffle-test-1',
                description: 'raffle-description',
                image: './asset/raffles/raffle1.png',
                pricePeerTicket: 10,
                initialAmount: 10,
                status: RaffleStatus.PUBLIC,
                createdBy: '803e341a-0884-40ed-bcaa-5c9b5f604c4d',
                endsAt: new Date()
            }

            const raffle = await raffleService.create(dto)
            expect(raffle).toBeInstanceOf(Raffle)

            raffleId = raffle.id
        })
        */

        /*
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
    */
    
})