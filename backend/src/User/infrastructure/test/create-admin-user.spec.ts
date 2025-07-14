import { CreatePermissionDTO } from "src/Permission/application/create-permission.dto"
import { CreateUserDTO } from "src/User/application/create-user.dto"
import { UserService } from "src/User/application/user.service"
import { User, UserType } from "src/User/domain/user.entity"
import { createUserTestingModule } from "./create-user-testing-module"

describe('Admin user creation', () => {
    let service: UserService

    beforeAll(async () => {
        const module = await createUserTestingModule()
        service = module.get(UserService)
    })

    it('should create an admin user', async () => {
        const createPermissionDTO: CreatePermissionDTO = {
            managePaymentMethods: true,
            manageRaffles: true,
            manageSellers: true,
            manageTickets: true,
            manageCustomers: true,
            manageChatbot: true,
            manageOrders: true,
        }

        const dto: CreateUserDTO = {
            name: 'Israel',
            role: UserType.ADMIN,
            email: 'kchido@gmail.com',
            password: 'kchido',
            permissions: createPermissionDTO
        }
    
        const user = await service.create(dto)
        expect(user).toBeInstanceOf(User)
    })
})