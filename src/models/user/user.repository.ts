import { EntityRepository, getRepository } from 'typeorm';
import { classToPlain, plainToClass } from 'class-transformer';
import { ModelRepository } from '../model.repository';
import { User } from './entities/user.entity';
import {
  UserEntity,
  allUserGroupsForSerializing,
  extendedUserGroupsForSerializing,
} from './serializers/user.serializer';
import { NotFoundException } from '@nestjs/common';

@EntityRepository(User)
export class UserRepository extends ModelRepository<User, UserEntity> {
  transform(model: User): UserEntity {
    const tranformOptions = {
      groups: allUserGroupsForSerializing,
    };
    return plainToClass(
      UserEntity,
      classToPlain(model, tranformOptions),
      tranformOptions,
    );
  }

  transformWithSerializer(entity: UserEntity): UserEntity {
    const tranformOptions = {
      groups: extendedUserGroupsForSerializing,
    };
    return plainToClass(UserEntity, entity, tranformOptions);
  }

  transformMany(models: User[]): UserEntity[] {
    return models.map((model) => this.transform(model));
  }

  async findByCond(
    cond: { [key: string]: any },
    throwsException = false,
  ): Promise<UserEntity | null> {
    return await this.findOne({
      where: cond,
    })
      .then((entity) => {
        if (!entity && throwsException) {
          return Promise.reject(new NotFoundException('Model not found.'));
        }

        return Promise.resolve(entity ? this.transform(entity) : null);
      })
      .catch((error) => Promise.reject(error));
  }

  async getAllEntities(query: [string, string][]): Promise<UserEntity[]> {
    const q = getRepository(User).createQueryBuilder('user');

    query.forEach(([k, v]) => {
      q.andWhere(`user.${this.toUnderscoreCase(k)} = :value`, { value: v });
    });

    return this.transformMany(await q.getMany());
  }
}
