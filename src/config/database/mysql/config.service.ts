import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class MysqlConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const type: any = this.configService.get<string>('mysql.type');
    return {
      type,
      host: this.configService.get<string>('mysql.host'),
      port: this.configService.get<number>('mysql.port'),
      username: this.configService.get<string>('mysql.username'),
      password: this.configService.get<string>('mysql.password'),
      database: this.configService.get<string>('mysql.database'),
      logging: this.configService.get<boolean>('mysql.logging'),
      synchronize: this.configService.get<boolean>('mysql.synchronize'),
      entities: this.configService.get<string[]>('mysql.entities'),
    };
  }
}
