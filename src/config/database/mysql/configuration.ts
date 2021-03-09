import { registerAs } from '@nestjs/config';
import { User } from '@/models/user/entities/user.entity';
import { UserDetail } from '@/models/userDetail/entities/user-detail.entity';
import { Vacation } from '@/models/vacation/entities/vacation.entity';

export default registerAs('mysql', () => ({
  type: 'mysql',
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  logging: process.env.MYSQL_LOGGING === 'true',
  synchronize: process.env.MYSQL_SYNCHRONIZE === 'true',
  keepConnectionAlive: process.env.MYSQL_KEEP_CONNECTION_ALIVE === 'true',
  entities: [User, UserDetail, Vacation],
}));
