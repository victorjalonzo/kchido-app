import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "../application/user.service";
import { UserController } from "./user.controller";
import { SharedModule } from "src/Shared/shared.module";
import { CreateUserDTO } from "../application/create-user.dto";
import { User } from "../domain/user.entity";
import { PermissionModule } from "src/Permission/infrastructure/permission.module";
import { CreatePermissionDTO } from "src/Permission/application/create-permission.dto";

describe('UserModule', () => {
    let userService: UserService
    let userController: UserController

    describe('UserService', () => {
        beforeEach(async () => {
            const module = <TestingModule>await Test.createTestingModule({
                imports: [SharedModule, PermissionModule],
                providers: [UserService],
                controllers: [UserController]
            }).compile()
    
            userService = await module.resolve(UserService)
            userController = await module.resolve(UserController)
        })

        it('it should create a user', async () => {
            const createPermissionDTO: CreatePermissionDTO = {
                manageRaffles: true,
                manageCustomers: true,
                manageChatbot: true,
                manageOrders: true,
                managePaymentMethods: true,
                manageSellers: true,
                manageTickets: true
            }

            const dto: CreateUserDTO = {
                name: 'user-owner-test',
                role: 'owner',
                number: '8092322312',
                permissions: createPermissionDTO
            }
            const user = await userService.create(dto)
            expect(user).toBeInstanceOf(User)
            console.log(user)
        })
    
        it('it should retrieve a list of users', async () => {
            const users = await userService.findMany()
    
            expect(Array.isArray(users)).toBe(true)
            console.log(users)
        })
    })
})