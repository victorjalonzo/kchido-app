import { UserService } from "src/User/application/user.service"
import { createUserTestingModule } from "./create-user-testing-module"
import { CreateUserDTO } from "src/User/application/create-user.dto"
import { User, UserType } from "src/User/domain/user.entity"
import { CreatePermissionDTO } from "src/Permission/application/create-permission.dto"

describe('Chatbot user creation', () => {
    let service: UserService

    beforeAll(async () => {
        const module = await createUserTestingModule()
        service = module.get(UserService)
    })

    it('should create a chatbot user', async () => {
        const createPermissionDTO: CreatePermissionDTO = {
            manageCustomers: true,
            manageChatbot: true,
            manageOrders: true,
        }

        const dto: CreateUserDTO = {
            name: 'Chatbot',
            role: UserType.CHATBOT,
            email: 'chatbot@kchido.com',
            password: 'itFyRDItPxgpEaNr608StcPDIeY6bTiF',
            permissions: createPermissionDTO
        }
    
        const user = await service.create(dto)
        expect(user).toBeInstanceOf(User)
    })
})