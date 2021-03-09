import { BadRequestException, Query } from '@nestjs/common';
import { classToPlain, plainToClass } from 'class-transformer';
import {
  Brackets,
  DeepPartial,
  EntityRepository,
  getConnection,
  getRepository,
} from 'typeorm';
import { ModelRepository } from '../model.repository';
import { User } from '../user/entities/user.entity';
import { UserDetail } from '../userDetail/entities/user-detail.entity';
import { Vacation } from './entities/vacation.entity';
import {
  allVacationGroupsForSerializing,
  extendedVacationGroupsForSerializing,
  VacationEntity,
} from './serializers/vacation.serializer';

@EntityRepository(Vacation)
export class VacationRepository extends ModelRepository<
  Vacation,
  VacationEntity
> {
  transform(model: Vacation): VacationEntity {
    const tranformOptions = {
      groups: allVacationGroupsForSerializing,
    };
    return plainToClass(
      VacationEntity,
      classToPlain(model, tranformOptions),
      tranformOptions,
    );
  }

  transformMany(models: Vacation[]): VacationEntity[] {
    return models.map((model) => this.transform(model));
  }

  transformWithSerializer(entity: VacationEntity): VacationEntity {
    const tranformOptions = {
      groups: extendedVacationGroupsForSerializing,
    };
    return plainToClass(VacationEntity, entity, tranformOptions);
  }

  async getAllEntities(
    userId: number,
    query: [string, string][],
  ): Promise<VacationEntity[]> {
    const q = getRepository(Vacation)
      .createQueryBuilder('vacation')
      .where('vacation.user_id = :userId', { userId });

    query.forEach(([k, v]) => {
      q.andWhere(`vacation.${this.toUnderscoreCase(k)} = :value`, { value: v });
    });

    return this.transformMany(await q.getMany());
  }

  async validateBeforeCreate(
    inputs: DeepPartial<Vacation>,
  ): Promise<DeepPartial<Vacation>> {
    if (!inputs.userId || !inputs.startDt || !inputs.endDt) {
      return Promise.reject(new BadRequestException('Missing arguments.'));
    }

    const isExists = await this.isExists(
      inputs.userId,
      inputs.startDt as Date,
      inputs.endDt as Date,
    );

    if (isExists) {
      return Promise.reject(new BadRequestException('Duplicated date.'));
    }

    const cnt = await this.getRemainedVacation(inputs.userId, inputs.year);

    if (inputs.numOfDays > cnt) {
      return Promise.reject(
        new BadRequestException('Exceeding the number of vacations allowed.'),
      );
    }

    return Promise.resolve(inputs);
  }

  async validateBeforeUpdate(entity: VacationEntity): Promise<VacationEntity> {
    const { userId, year, startDt, endDt } = entity;
    const isExists = await this.isExists(userId, startDt, endDt);

    if (isExists) {
      return Promise.reject(new BadRequestException('Duplicated date.'));
    }

    const cnt = await this.getRemainedVacation(userId, year);

    if (entity.numOfDays > cnt) {
      return Promise.reject(
        new BadRequestException('Exceeding the number of vacations allowed.'),
      );
    }

    return Promise.resolve(entity);
  }

  async isExists(userId: number, startDt: Date, endDt: Date): Promise<boolean> {
    return getRepository(Vacation)
      .createQueryBuilder('vacation')
      .where('vacation.user_id = :userId', { userId })
      .andWhere(
        new Brackets((qb) => {
          qb.where(':startDt between vacation.start_dt and vacation.end_dt', {
            startDt,
          }).orWhere(':endDt between vacation.start_dt and vacation.end_dt', {
            endDt,
          });
        }),
      )
      .take(1)
      .getMany()
      .then((rsp) => rsp.length > 0);
  }

  async getRemainedVacation(id: number, year: string): Promise<number> {
    const { cnt } = await getRepository(User)
      .createQueryBuilder('user')
      .leftJoin(
        (sub) =>
          sub
            .select('v.user_id', 'user_id')
            .addSelect('sum(v.days)', 'days')
            .from(Vacation, 'v')
            .where('v.year = :year', { year })
            .groupBy('v.user_id'),
        'vacation',
        'user.id = vacation.user_id',
      )
      .leftJoin(
        (sub) =>
          sub.from(UserDetail, 'd').where('d.key = :key', { key: 'vacation' }),
        'detail',
        'user.id = detail.user_id',
      )
      .addSelect(
        'coalesce(cast(detail.value as unsigned), 15) - coalesce(vacation.days, 0)',
        'cnt',
      )
      .where('user.id = :id', { id })
      .getRawOne<{ cnt: number }>();

    return cnt;
  }

  async validateBeforeDelete(entity: Vacation): Promise<Vacation> {
    const now = new Date();

    if (entity && !entity.isCancelable(now)) {
      return Promise.reject(new BadRequestException('Already used.'));
    }

    return Promise.resolve(entity);
  }
}
