export class CreateOrUpdateVacationDto {
  year: string;
  startDt?: Date;
  endDt?: Date;
  numOfDays: number;
  comment?: string;
}
