import { plainToClass } from 'class-transformer';
import { Repository, DeepPartial } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { ModelEntity } from '../common/serializers/model.serializer';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export class ModelRepository<T, K extends ModelEntity> extends Repository<T> {
  async get(
    uuid: string,
    relations: string[] = [],
    throwsException = false,
  ): Promise<K | null> {
    return await this.findOne({
      where: { uuid },
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

  async createEntity(
    inputs: DeepPartial<T>,
    relations: string[] = [],
  ): Promise<K> {
    return this.validateBeforeCreate(inputs)
      .then(() => this.save(inputs))
      .then(
        async (entity) => await this.get((entity as any).uuid, relations, true),
      )
      .catch((error) => Promise.reject(error));
  }

  async updateEntity(
    uuid: string,
    inputs: QueryDeepPartialEntity<T>,
    relations: string[] = [],
  ): Promise<K> {
    return this.get(uuid, relations, true)
      .then((entity) => {
        if (inputs && Object.keys(inputs).length > 0) {
          return this.validateBeforeUpdate(entity).then(() =>
            this.update(entity.id, inputs),
          );
        }

        return Promise.resolve(null);
      })
      .then(() => this.get(uuid, relations));
  }

  async deleteEntity(uuid: string, throwsException = false): Promise<null> {
    return await this.findOne({
      where: { uuid },
    })
      .then((entity) => {
        if (!entity && throwsException) {
          return Promise.reject(new NotFoundException('Model not found.'));
        }

        return this.validateBeforeDelete(entity)
          .then((e) => this.delete(e))
          .then(() => Promise.resolve(null));
      })
      .catch((error) => Promise.reject(error));
  }

  async validateBeforeCreate(inputs: DeepPartial<T>): Promise<DeepPartial<T>> {
    return Promise.resolve(inputs);
  }

  async validateBeforeUpdate(entity: K): Promise<K> {
    return Promise.resolve(entity);
  }

  async validateBeforeDelete(entity: T): Promise<T> {
    return Promise.resolve(entity);
  }

  transform(model: T, transformOptions = {}): K {
    return plainToClass(ModelEntity, model, transformOptions) as K;
  }

  transformMany(models: T[], transformOptions = {}): K[] {
    return models.map((model) => this.transform(model, transformOptions));
  }

  toUnderscoreCase(str: string): string {
    if (!str) {
      return str;
    }
    const arr = str.split(/(?=[A-Z])/);
    for (let i = 0; i < arr.length; i++) {
      if (arr[i]) {
        arr[i] =
          (i > 0 ? '_' : '') +
          arr[i].substr(0, 1).toLowerCase() +
          (arr[i].length > 1 ? arr[i].substr(1).toLowerCase() : '');
      }
    }
    return arr.join('');
  }
}
