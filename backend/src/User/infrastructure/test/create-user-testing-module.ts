import { Test } from "@nestjs/testing"
import { PermissionModule } from "src/Permission/infrastructure/permission.module"
import { SharedModule } from "src/Shared/shared.module"
import { UserService } from "src/User/application/user.service"
import { UserController } from "../user.controller"

export const createUserTestingModule = async () => {
    return await Test.createTestingModule({
        imports: [SharedModule, PermissionModule],
        exports: [UserService],
        providers: [UserService],
        controllers: [UserController]
    })
    .compile()
}