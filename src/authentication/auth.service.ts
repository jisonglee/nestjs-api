import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '@/models/user/user.service';
import { Auth, JwtPayload } from './interfaces/jwt-payload.interface';
import { LoginDto } from './dto/login.dto';
import { Token } from './interfaces/token.interface';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from '@/models/user/serializers/user.serializer';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  getJwtToken(uuid: string): Auth {
    const payload: Token = { uuid };
    const accessToken = this.jwtService.sign(payload);
    return {
      expiresIn: this.configService.get<number>('jwt.expiresIn'),
      accessToken,
    };
  }

  async logIn(inputs: LoginDto): Promise<JwtPayload> {
    const user = await this.validateUser(inputs.username, inputs.password);
    const auth = this.getJwtToken(user.uuid);
    return { ...user, auth };
  }

  async validateUser(username: string, password: string): Promise<UserEntity> {
    const user = await this.userService.findByUsername(username);

    if (password && (await bcrypt.compare(password, user.password))) {
      user.password = undefined;
      return await this.userService.logIn(user.uuid, {
        lastLoginedAt: new Date(),
      });
    }
    return Promise.reject(
      new BadRequestException('Invalid username or password.'),
    );
  }
}
