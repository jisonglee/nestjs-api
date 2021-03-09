import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response, HttpResponse } from '../entities/response.entity';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<HttpResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        const { message, result, auth, ...rest } = data || {};
        return {
          statusCode: context.switchToHttp().getResponse().statusCode,
          message,
          result,
          auth,
          ...(rest && {
            objects: Array.isArray(rest)
              ? rest
              : Object.entries(rest).length == 0
              ? undefined
              : new Array(rest),
          }),
          ...(Array.isArray(data) && {
            objects: data,
          }),
        };
      }),
    );
  }
}
