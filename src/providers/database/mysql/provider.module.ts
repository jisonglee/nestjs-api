import { DatabaseType } from 'typeorm';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MysqlConfigModule } from '@/config/database/mysql/config.module';
import { MysqlConfigService } from '@/config/database/mysql/config.service';

/**
 * @module
 */

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [MysqlConfigModule],
      useClass: MysqlConfigService,
    }),
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class MysqlDatabaseProviderModule {}
