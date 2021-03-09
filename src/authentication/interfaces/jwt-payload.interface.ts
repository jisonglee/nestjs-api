import { UserEntity } from '@/models/user/serializers/user.serializer';

export interface JwtPayload extends UserEntity {
  auth: Auth;
}

export interface Auth {
  expiresIn: number;
  accessToken: string;
}
