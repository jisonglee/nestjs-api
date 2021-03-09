import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from './common/entities/response.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/hello')
  getHello(): Response<any> {
    return {
      result: {
        code: 0,
      },
      message: this.appService.getHello(),
    };
  }
}
