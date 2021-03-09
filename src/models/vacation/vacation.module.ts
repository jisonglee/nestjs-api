import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MysqlDatabaseProviderModule } from '@/providers/database/mysql/provider.module';
import { JwtStrategy } from '@/authentication/jwt.strategy';
import { UserRepository } from '../user/user.repository';
import { VacationRepository } from './vacation.repository';
import { VacationService } from './vacation.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([VacationRepository]),
    TypeOrmModule.forFeature([UserRepository]),
    MysqlDatabaseProviderModule,
  ],
  providers: [VacationService],
  exports: [
    VacationService,
    TypeOrmModule.forFeature([VacationRepository]),
    TypeOrmModule.forFeature([UserRepository]),
  ],
})
export class VacationModule {}
