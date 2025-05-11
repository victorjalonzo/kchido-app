import { Module} from "@nestjs/common"
import { UserService } from "../application/user.service"
import { UserController } from "./user.controller"
import { SharedModule } from "../../Shared/shared.module"

@Module({
    imports: [SharedModule],
    providers: [UserService],
    controllers: [UserController]
})
export class UserModule {}