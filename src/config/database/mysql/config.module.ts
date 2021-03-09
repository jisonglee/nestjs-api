import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import Configuration from './configuration';
const { MODE } = process.env;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `config/.env.${MODE}`,
      load: [Configuration],
    }),
  ],
})
export class MysqlConfigModule {}
