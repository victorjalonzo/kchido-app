import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/User/application/user.service';
import { LoginDto } from './login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService
  ) {}

  async login(dto: LoginDto) {
    const user = await this._validateUser(dto.email, dto.password);
    const payload = { sub: user.id, email: user.email };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async _validateUser(email: string, password: string) {
    return await this.usersService.findByEmail(email)
    .then(user => {
        if (user.password !== password) throw new UnauthorizedException();
        return user;
    })
    .catch(() => {
        throw new UnauthorizedException()
    })
  }
}
