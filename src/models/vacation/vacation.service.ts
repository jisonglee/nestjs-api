import { BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ModelService } from '../model.service';
import { UserRepository } from '../user/user.repository';
import { CreateOrUpdateVacationDto } from './dto/vacation.dto';
import { VacationEntity } from './serializers/vacation.serializer';
import { VacationRepository } from './vacation.repository';

export class VacationService extends ModelService {
  constructor(
    @InjectRepository(VacationRepository)
    private readonly vacationRepository: VacationRepository,
    private readonly userRepository: UserRepository,
  ) {
    super();
  }

  async getAll(
    id: string,
    query: [string, string][],
    relations: string[] = [],
  ): Promise<VacationEntity[]> {
    return await this.userRepository.get(id, relations, true).then((rsp) => {
      return this.vacationRepository.getAllEntities(rsp.id, query);
    });
  }

  async create(
    userId: string,
    inputs: CreateOrUpdateVacationDto,
  ): Promise<VacationEntity> {
    const user = await this.userRepository.get(userId, [], true);
    const dto = await this.validate(inputs);
    const result = await this.vacationRepository.createEntity({
      ...dto,
      userId: user.id,
      uuid: this.generateUUID(),
      operator: user.username,
    });
    const remainedDays = await this.vacationRepository.getRemainedVacation(
      user.id,
      dto.year,
    );

    return {
      ...this.vacationRepository.transformWithSerializer(result),
      remainedDays,
    };
  }

  async update(
    userId: string,
    id: string,
    inputs: CreateOrUpdateVacationDto,
  ): Promise<VacationEntity> {
    const user = await this.userRepository.get(userId, [], true);
    const dto = await this.validate(inputs);
    const result = await this.vacationRepository.updateEntity(id, {
      ...dto,
      userId: user.id,
      operator: user.username,
    });
    const remainedDays = await this.vacationRepository.getRemainedVacation(
      user.id,
      dto.year,
    );
    return {
      ...this.vacationRepository.transformWithSerializer(result),
      remainedDays,
    };
  }

  async delete(id: string, throwsException = false): Promise<null> {
    return await this.vacationRepository.deleteEntity(id, throwsException);
  }

  validate(dto: CreateOrUpdateVacationDto): Promise<CreateOrUpdateVacationDto> {
    const now = new Date();
    const newDto: CreateOrUpdateVacationDto = { ...dto };

    if (!newDto.year) {
      newDto.year = String(now.getFullYear());
    }

    if (newDto.startDt) {
      newDto.startDt = new Date(newDto.startDt);
    }

    if (newDto.endDt) {
      newDto.endDt = new Date(newDto.endDt);
    }

    now.setHours(0, 0, 0, 0);

    if (String(now.getFullYear()) !== dto.year) {
      return Promise.reject(new BadRequestException('Invalid date.'));
    }

    if ([0.25, 0.5].includes(dto.numOfDays)) {
      // 반차, 반반차
      if (!dto.startDt) {
        newDto.startDt = now;
        newDto.endDt = now;
      } else {
        newDto.endDt = new Date(dto.startDt);
      }
    } else {
      // 연차
      if (Math.ceil(dto.numOfDays) !== dto.numOfDays || dto.numOfDays < 1) {
        return Promise.reject(new BadRequestException('Invalid date.'));
      }

      const difference = Math.ceil(
        newDto.endDt?.getTime() -
          newDto.startDt?.getTime() / (1000 * 3600 * 24),
      );

      // 휴일 수가 날짜 범위를 넘어섰는지 체크
      if (newDto.numOfDays > difference) {
        return Promise.reject(new BadRequestException('Invalid date.'));
      }
    }

    // 날짜가 연도를 벗어났는지 체크
    if (
      String(newDto.startDt?.getFullYear()) !== dto.year ||
      String(newDto.endDt?.getFullYear()) !== dto.year
    ) {
      return Promise.reject(new BadRequestException('Invalid date.'));
    }

    return Promise.resolve(newDto);
  }
}
