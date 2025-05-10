import { Module} from "@nestjs/common"
import { UserService } from "../application/user.service.js"
import { UserController } from "./user.controller.js"
import { SharedModule } from "../../Shared/shared.module.js"

@Module({
    imports: [SharedModule],
    providers: [UserService],
    controllers: [UserController]
})
export class UserModule {}