import { Module} from "@nestjs/common"
import { UserService } from "../application/user.service.js"
import { UserController } from "./user.controller.js"
import { UserRepository } from "./user.repository.js"
import { PrismaModule } from "../../Database/prisma.module.js"

@Module({
    imports: [PrismaModule],
    providers: [UserService, UserRepository],
    controllers: [UserController]
})
export class UserModule {}