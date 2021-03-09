import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { ModelService } from '../model.service';
import { UserRepository } from './user.repository';
import { UserEntity } from './serializers/user.serializer';
import { CreateUserDto, LoginUserDto, UpdateUserDto } from './dto/user.dto';
import { UserDetailRepository } from '../userDetail/user-detail.repository';
import { CreateOrUpdateUserDetailDao } from '../userDetail/dto/user-detail.dao';
import { UserDetail } from '../userDetail/entities/user-detail.entity';

@Injectable()
export class UserService extends ModelService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly userDetailRepository: UserDetailRepository,
  ) {
    super();
  }

  async getAll(query: [string, string][] = []): Promise<UserEntity[]> {
    return await this.userRepository.getAllEntities(query);
  }

  async get(
    id: string,
    relations: string[] = ['details'],
    throwsException = false,
  ): Promise<UserEntity | null> {
    return await this.userRepository.get(id, relations, throwsException);
  }

  async create(inputs: CreateUserDto): Promise<UserEntity> {
    const { details = [], ...rest } = inputs;
    rest.password = await this.encode(rest.password);
    return await this.userRepository
      .createEntity({
        ...rest,
        uuid: this.generateUUID(),
        operator: this.getDefaultOperator(),
      })
      .then(async (rsp) => {
        const d = await this.createOrUpdateDetails(rsp.id, details);
        return this.userRepository.transformWithSerializer({
          ...rsp,
          details: d,
        });
      });
  }

  async update(id: string, inputs: UpdateUserDto): Promise<UserEntity> {
    const { details = [], ...rest } = inputs;
    if (rest.password) {
      rest.password = await this.encode(rest.password);
    }
    return await this.userRepository
      .updateEntity(id, rest)
      .then(async (rsp) => {
        const d = await this.createOrUpdateDetails(rsp.id, details);
        return this.userRepository.transformWithSerializer({
          ...rsp,
          details: d,
        });
      });
  }

  async delete(id: string, throwsException = false): Promise<null> {
    return await this.userRepository.deleteEntity(id, throwsException);
  }

  async findByUsername(
    username: string,
    throwsException = false,
  ): Promise<UserEntity | null> {
    return await this.userRepository.findByCond({ username }, throwsException);
  }

  async logIn(id: string, inputs: LoginUserDto): Promise<UserEntity> {
    const rsp = await this.userRepository.updateEntity(id, inputs);
    return this.userRepository.transformWithSerializer(rsp);
  }

  async createOrUpdateDetails(
    userId: number,
    inputs: CreateOrUpdateUserDetailDao[],
  ): Promise<UserDetail[]> {
    return await this.userDetailRepository.createOrUpdateEntity(
      userId,
      inputs.map((i) => ({ ...i, operator: this.getDefaultOperator() })),
    );
  }

  async encode(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }
}
