import { TestingModule, Test } from "@nestjs/testing";
import { AuthService } from "../application/auth.service";
import { AuthController } from "./auth.controller";
import { UserModule } from "src/User/infrastructure/user.module";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { SharedConfig } from "src/Shared/shared.config";
import { LoginDto } from "../application/login.dto";

export const authTestingModule = Test.createTestingModule({
    imports: [
        UserModule,
        PassportModule,
        JwtModule.register({
            secret: SharedConfig.jwtSecret,
            signOptions: {expiresIn: SharedConfig.jwtExpiresIn}
        })
    ],
    providers: [AuthService],
    controllers: [AuthController]
})

describe('AuthModule', () => {
    let service: AuthService
    let controller: AuthController

    beforeEach(async () => {
        const authModule = await authTestingModule.compile()

        service = authModule.get(AuthService)
        controller = authModule.get(AuthController)
    })

    const dto: LoginDto = {
        email: 'helloworld@gmail.com',
        password: 'helloworld'
    }

    describe('AuthController', () => {
        it ('should return an access token', async () => {
            const result = await controller.login(dto)

            expect(result).toEqual({
                accessToken: expect.any(String),
            });

            console.log(result)
        })
    })
})