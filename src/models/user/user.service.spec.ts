import { Test, TestingModule } from '@nestjs/testing';
import * as faker from 'faker';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { UserModule } from './user.module';
import { UserService } from './user.service';

describe('UserService', () => {
  let userService: UserService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UserModule],
      providers: [UserService],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  describe('create', () => {
    it('should create a user', async () => {
      const beforeCreate = (await userService.getAll()).length;

      const createUserDto: CreateUserDto = {
        username: faker.internet.userName(),
        password: faker.internet.password(),
        details: [
          {
            key: 'vacation',
            value: '15',
          },
        ],
      };

      const result = await userService.create(createUserDto);
      const afterCreate = (await userService.getAll()).length;
      expect(afterCreate).toBeGreaterThan(beforeCreate);
      expect(result.username).toEqual(createUserDto.username);
      expect(result.details.length).toEqual(createUserDto.details.length);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const createUserDto: CreateUserDto = {
        username: faker.internet.userName(),
        password: faker.internet.password(),
        details: [
          {
            key: 'vacation',
            value: '15',
          },
        ],
      };

      const resultAfterCreate = await userService.create(createUserDto);

      const updateUserDto: UpdateUserDto = {
        password: faker.internet.password(),
        details: [
          {
            key: 'vacation',
            value: '16',
          },
        ],
      };

      const resultAfterUpdate = await userService.update(
        resultAfterCreate.uuid,
        updateUserDto,
      );

      expect(
        resultAfterUpdate.details.find((e) => e.key == 'vacation').value,
      ).toEqual(updateUserDto.details.find((e) => e.key == 'vacation').value);
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      const createUserDto: CreateUserDto = {
        username: faker.internet.userName(),
        password: faker.internet.password(),
        details: [
          {
            key: 'vacation',
            value: '15',
          },
        ],
      };

      const resultAfterCreate = await userService.create(createUserDto);

      const resultAfterDelete = await userService.delete(
        resultAfterCreate.uuid,
      );

      expect(resultAfterDelete).toBe(null);
    });
  });
});
