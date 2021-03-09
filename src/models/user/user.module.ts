import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { MysqlDatabaseProviderModule } from '@/providers/database/mysql/provider.module';
import { JwtStrategy } from '@/authentication/jwt.strategy';
import { UserDetailRepository } from '../userDetail/user-detail.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository]),
    TypeOrmModule.forFeature([UserDetailRepository]),
    MysqlDatabaseProviderModule,
  ],
  providers: [UserService],
  exports: [
    UserService,
    TypeOrmModule.forFeature([UserRepository]),
    TypeOrmModule.forFeature([UserDetailRepository]),
  ],
})
export class UserModule {}
