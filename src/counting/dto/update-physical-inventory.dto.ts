import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsEnum, IsDateString } from 'class-validator';
import { CreatePhysicalInventoryDto, PhysicalInventoryStatus } from './create-physical-inventory.dto';

export class UpdatePhysicalInventoryDto extends PartialType(CreatePhysicalInventoryDto) {
  @IsOptional()
  @IsEnum(PhysicalInventoryStatus)
  status?: PhysicalInventoryStatus;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  completedDate?: string;
}

