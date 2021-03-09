import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';

export class ModelService {
  generateUUID(): string {
    const tokens = uuidv4().split('-');
    return [2, 1, 0, 3, 4].map((e) => tokens[e]).join('');
  }

  getDefaultOperator(): string {
    return process.env.APP_ID;
  }
}
