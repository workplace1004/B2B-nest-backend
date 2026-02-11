import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsEnum, IsDateString } from 'class-validator';
import { CreateCycleCountDto, CycleCountStatus } from './create-cycle-count.dto';

export class UpdateCycleCountDto extends PartialType(CreateCycleCountDto) {
  @IsOptional()
  @IsEnum(CycleCountStatus)
  status?: CycleCountStatus;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  completedDate?: string;
}

