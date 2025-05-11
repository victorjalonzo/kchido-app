import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "../application/user.service";
import { UserController } from "./user.controller";
import { SharedModule } from "src/Shared/shared.module";

describe('UserModule', () => {
    let userService: UserService
    let userController: UserController

    describe('UserService', () => {
        beforeEach(async () => {
            const module = <TestingModule>await Test.createTestingModule({
                imports: [SharedModule],
                providers: [UserService],
                controllers: [UserController]
            }).compile()
    
            userService = await module.resolve(UserService)
            userController = await module.resolve(UserController)
        })

        it('it should create a user', async () => {
            const user = await userService.create()
        })
    
        it('it should retrieve a list of users', async () => {
            const users = await userService.findMany()
    
            expect(Array.isArray(users)).toBe(true)
        })
    })
})