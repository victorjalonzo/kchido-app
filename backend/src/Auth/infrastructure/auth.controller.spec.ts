import { TestingModule, Test } from "@nestjs/testing";
import { AuthService } from "../application/auth.service";
import { AuthController } from "./auth.controller";
import { UserModule } from "src/User/infrastructure/user.module";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { sharedConfig } from "src/Shared/shared.config";
import { LoginDto } from "../application/login.dto";

export const authTestingModule = Test.createTestingModule({
    imports: [
        UserModule,
        PassportModule,
        JwtModule.register({
            secret: sharedConfig.jwtSecret,
            signOptions: {expiresIn: sharedConfig.jwtExpiresIn}
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
        email: 'chatbot@kchido.com',
        password: 'itFyRDItPxgpEaNr608StcPDIeY6bTiF'
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