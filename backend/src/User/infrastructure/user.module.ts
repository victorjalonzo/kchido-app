import { Module} from "@nestjs/common"
import { UserService } from "../application/user.service"
import { UserController } from "./user.controller"
import { SharedModule } from "../../Shared/shared.module"
import { PermissionModule } from "src/Permission/infrastructure/permission.module"

@Module({
    imports: [SharedModule, PermissionModule],
    providers: [UserService],
    controllers: [UserController]
})
export class UserModule {}