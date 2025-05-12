import { Module} from "@nestjs/common"
import { UserService } from "../application/user.service"
import { UserController } from "./user.controller"
import { SharedModule } from "../../Shared/shared.module"
import { PermissionService } from "src/Permission/application/permission.service"

@Module({
    imports: [SharedModule, PermissionService],
    providers: [UserService],
    controllers: [UserController]
})
export class UserModule {}