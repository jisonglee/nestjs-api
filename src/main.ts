import { NestFactory } from '@nestjs/core';
import { TransformInterceptor } from '@/common/interceptors/tranform.interceptor';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.useGlobalInterceptors(new TransformInterceptor());
  app.use(cookieParser());
  await app.listen(3000);
}

bootstrap();
