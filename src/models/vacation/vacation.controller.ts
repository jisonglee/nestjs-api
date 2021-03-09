import JwtAuthenticationGuard from '@/authentication/jwt-auth.guard';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateOrUpdateVacationDto } from './dto/vacation.dto';
import {
  extendedVacationGroupsForSerializing,
  VacationEntity,
} from './serializers/vacation.serializer';
import { VacationService } from './vacation.service';

@Controller('user/:userId/vacation')
@SerializeOptions({
  groups: extendedVacationGroupsForSerializing,
})
@UseGuards(JwtAuthenticationGuard)
export class VacationController {
  constructor(private readonly vacationService: VacationService) {}

  @Get('/')
  @UseInterceptors(ClassSerializerInterceptor)
  async get(
    @Param('userId') userUUID: string,
    @Query() query,
  ): Promise<VacationEntity[]> {
    return await this.vacationService.getAll(userUUID, Object.entries(query));
  }

  @Post('/')
  @UseInterceptors(ClassSerializerInterceptor)
  async create(
    @Param('userId') userUUID: string,
    @Body() inputs: CreateOrUpdateVacationDto,
  ): Promise<VacationEntity> {
    return await this.vacationService.create(userUUID, inputs);
  }

  @Put('/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  async update(
    @Param('userId') userUUID: string,
    @Param('id') uuid: string,
    @Body() inputs: CreateOrUpdateVacationDto,
  ): Promise<VacationEntity> {
    return await this.vacationService.update(userUUID, uuid, inputs);
  }

  @Delete('/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  async delete(@Param('id') uuid: string): Promise<null> {
    return await this.vacationService.delete(uuid, true);
  }
}
