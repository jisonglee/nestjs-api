import { Test, TestingModule } from '@nestjs/testing';
import * as faker from 'faker';
import { UserModule } from '@/models/user/user.module';
import { UserService } from '@/models/user/user.service';
import { AuthModule } from './auth.module';
import { AuthService } from './auth.service';
import { CreateUserDto } from '@/models/user/dto/user.dto';
import { LoginDto } from './dto/login.dto';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;

  const username: string = faker.internet.userName();
  const password: string = faker.internet.password();

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule, UserModule],
      providers: [UserService],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);

    const createUserDto: CreateUserDto = {
      username,
      password,
    };

    const result = await userService.create(createUserDto);
  });

  describe('login', () => {
    it('should create a user', async () => {
      const loginDto: LoginDto = {
        username,
        password,
      };

      const result = await authService.logIn(loginDto);
      expect(result.auth).toBeDefined;
      expect(result.auth.accessToken).toBeDefined;
    });
  });
});
