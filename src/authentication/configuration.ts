import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  expiresIn: process.env.TOKEN_EXPIRES_IN,
  secret: process.env.TOKEN_SECRET,
}));
