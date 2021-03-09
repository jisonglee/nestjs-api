import { Test, TestingModule } from '@nestjs/testing';
import * as faker from 'faker';
import { CreateUserDto } from '../user/dto/user.dto';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { CreateOrUpdateVacationDto } from './dto/vacation.dto';
import { VacationModule } from './vacation.module';
import { VacationService } from './vacation.service';

describe('UserService', () => {
  let userService: UserService;
  let vacationService: VacationService;
  let userUUID: string;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UserModule, VacationModule],
      providers: [UserService, VacationService],
    }).compile();

    userService = module.get<UserService>(UserService);
    vacationService = module.get<VacationService>(VacationService);

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
    userUUID = result.uuid;
  });

  describe('create', () => {
    it('should create a vacation', async () => {
      const now = new Date();
      const beforeCreate = (
        await vacationService.getAll(userUUID, [
          ['year', String(now.getFullYear())],
        ])
      ).length;

      const createVacationDto: CreateOrUpdateVacationDto = {
        year: String(now.getFullYear()),
        startDt: new Date(now),
        endDt: new Date(now),
        numOfDays: 1,
        comment: 'Create Vacation',
      };

      const result = await vacationService.create(userUUID, createVacationDto);
      const afterCreate = (
        await vacationService.getAll(userUUID, [
          ['year', String(now.getFullYear())],
        ])
      ).length;
      expect(afterCreate).toBeGreaterThan(beforeCreate);
    });
  });

  describe('update', () => {
    it('should update a vacation', async () => {
      const now = new Date();

      now.setDate(now.getDate() + 1);
      now.setHours(0, 0, 0, 0);

      const createVacationDto: CreateOrUpdateVacationDto = {
        year: String(now.getFullYear()),
        startDt: now,
        endDt: now,
        numOfDays: 1,
        comment: 'Create Vacation',
      };

      const resultAfterCreate = await vacationService.create(
        userUUID,
        createVacationDto,
      );

      now.setDate(now.getDate() + 1);

      const updateVacationDto: CreateOrUpdateVacationDto = {
        year: String(now.getFullYear()),
        startDt: now,
        endDt: now,
        numOfDays: 1,
        comment: 'Update Vacation',
      };

      const resultAfterUpdate = await vacationService.update(
        userUUID,
        resultAfterCreate.uuid,
        updateVacationDto,
      );

      expect(resultAfterUpdate.comment).toEqual(updateVacationDto.comment);
    });
  });

  describe('delete', () => {
    it('should delete a vacation', async () => {
      const now = new Date();

      now.setDate(now.getDate() + 3);
      now.setHours(0, 0, 0, 0);

      const createVacationDto: CreateOrUpdateVacationDto = {
        year: String(now.getFullYear()),
        startDt: now,
        endDt: now,
        numOfDays: 1,
        comment: 'Create Vacation',
      };

      const resultAfterCreate = await vacationService.create(
        userUUID,
        createVacationDto,
      );

      const resultAfterDelete = await vacationService.delete(
        resultAfterCreate.uuid,
      );

      expect(resultAfterDelete).toBe(null);
    });
  });
});
