import { Controller, Post, Body, UsePipes, ValidationPipe, Get, Req, UseGuards, Put, Patch, UseFilters } from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { LoginDto } from '../application/login.dto';
import { Request } from 'express';
import { UserService } from 'src/User/application/user.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UpdateMeDTO } from '../application/update-me.dto';
import { UserExceptionFilter } from 'src/User/infrastructure/user-exception.filter';


@UseFilters(UserExceptionFilter)
@Controller('api/v1/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  @UsePipes(new ValidationPipe())
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() req: Request) {
    const userId = req.user.userId
    return await this.userService.findById(userId, { permissions: true})
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Patch('me')
  async updateMe(@Req() req: Request, @Body() dto: UpdateMeDTO) {
    return await this.userService.updateSelf(req.user.userId, dto, { permissions: true })
  }
}
