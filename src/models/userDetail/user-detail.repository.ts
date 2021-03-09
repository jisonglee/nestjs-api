import {
  DeepPartial,
  EntityRepository,
  getConnection,
  getRepository,
  Repository,
} from 'typeorm';
import { classToPlain, plainToClass } from 'class-transformer';
import { UserDetail } from './entities/user-detail.entity';
import {
  allUserDetailGroupsForSerializing,
  UserDetailEntity,
} from './serializers/user-detail.serializer';
import { NotFoundException } from '@nestjs/common';

@EntityRepository(UserDetail)
export class UserDetailRepository extends Repository<UserDetail> {
  transform(model: UserDetail): UserDetailEntity {
    const tranformOptions = {
      groups: allUserDetailGroupsForSerializing,
    };
    return plainToClass(
      UserDetailEntity,
      classToPlain(model, tranformOptions),
      tranformOptions,
    );
  }

  transformMany(models: UserDetail[]): UserDetailEntity[] {
    return models.map((model) => this.transform(model));
  }

  async get(
    userId: number,
    key: string,
    relations: string[] = [],
    throwsException = false,
  ): Promise<UserDetailEntity | null> {
    return await this.findOne({
      where: { userId, key },
      relations,
    })
      .then((entity) => {
        if (!entity && throwsException) {
          return Promise.reject(new NotFoundException('Model not found.'));
        }

        return Promise.resolve(entity ? this.transform(entity) : null);
      })
      .catch((error) => Promise.reject(error));
  }

  async getAllEntities(userId: number): Promise<UserDetailEntity[]> {
    return await getRepository(UserDetail)
      .createQueryBuilder('detail')
      .where('detail.user_id = :userId', { userId })
      .getMany()
      .then((rsp) => this.transformMany(rsp));
  }

  async createOrUpdateEntity(
    userId: number,
    inputs: DeepPartial<UserDetail[]>,
  ): Promise<UserDetailEntity[]> {
    return await Promise.all(
      inputs.map((i) => this.save({ ...i, userId })),
    ).then(() => this.getAllEntities(userId));
  }
}
