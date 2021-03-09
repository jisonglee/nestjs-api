import {
  Delete,
  Get,
  Put,
  Post,
  Body,
  Controller,
  UseGuards,
  UseInterceptors,
  SerializeOptions,
  ClassSerializerInterceptor,
  Param,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  UserEntity,
  extendedUserGroupsForSerializing,
} from './serializers/user.serializer';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import JwtAuthenticationGuard from '@/authentication/jwt-auth.guard';

@Controller('user')
@SerializeOptions({
  groups: extendedUserGroupsForSerializing,
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  @UseInterceptors(ClassSerializerInterceptor)
  async getAll(@Query() query): Promise<UserEntity[]> {
    return await this.userService.getAll(Object.entries(query));
  }

  @Get('/:id')
  @UseGuards(JwtAuthenticationGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async get(@Param('id') uuid: string): Promise<UserEntity> {
    return await this.userService.get(uuid);
  }

  @Post('/')
  @UseInterceptors(ClassSerializerInterceptor)
  async create(@Body() inputs: CreateUserDto): Promise<UserEntity> {
    return await this.userService.create(inputs);
  }

  @Put('/:id')
  @UseGuards(JwtAuthenticationGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async update(
    @Param('id') uuid: string,
    @Body() inputs: UpdateUserDto,
  ): Promise<UserEntity> {
    return await this.userService.update(uuid, inputs);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthenticationGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async delete(@Param('id') uuid: string): Promise<null> {
    return await this.userService.delete(uuid, true);
  }
}
