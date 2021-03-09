import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './authentication/auth.controller';
import { AuthModule } from './authentication/auth.module';
import { AuthService } from './authentication/auth.service';
import { UserController } from './models/user/user.controller';
import { UserModule } from './models/user/user.module';
import { UserService } from './models/user/user.service';
import { VacationController } from './models/vacation/vacation.controller';
import { VacationModule } from './models/vacation/vacation.module';
import { VacationService } from './models/vacation/vacation.service';

@Module({
  imports: [AuthModule, UserModule, VacationModule],
  controllers: [
    AuthController,
    UserController,
    VacationController,
    AppController,
  ],
  providers: [UserService, VacationService, AppService],
})
export class AppModule {}
