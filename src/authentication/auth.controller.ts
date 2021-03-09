import { UserEntity } from '@/models/user/serializers/user.serializer';
import { Controller, Post, Body, UseGuards, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Auth, JwtPayload } from './interfaces/jwt-payload.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/login')
  async logIn(@Body() inputs: LoginDto): Promise<JwtPayload> {
    return await this.authService.logIn(inputs);
  }
}
