import { Test, TestingModule } from "@nestjs/testing";
import { SharedRepository } from "./shared.repository";
import { Model } from "./shared.types";

describe('SharedModule', () => {
    let sharedRepository: SharedRepository<any>

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [SharedRepository],
            exports: [SharedRepository]
        }).compile()

        sharedRepository = module.get(SharedRepository)
    })
    describe('SharedService', () => {
        it ('should retrieve a list of users', async () => {
            const records = await sharedRepository.findMany(Model.USERS)
            expect(Array.isArray(records)).toBe(true)
        })

        it ('should retrieve a list of raffles', async () => {
            const records = await sharedRepository.findMany(Model.RAFFLES)
            expect(Array.isArray(records)).toBe(true)
        })
    })
})