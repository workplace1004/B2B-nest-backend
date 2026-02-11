import { PartialType } from '@nestjs/mapped-types';
import { CreateBOPISOrderDto, BOPISOrderStatus } from './create-bopis-order.dto';
import { IsEnum, IsOptional, IsDateString } from 'class-validator';

export class UpdateBOPISOrderDto extends PartialType(CreateBOPISOrderDto) {
  @IsOptional()
  @IsEnum(BOPISOrderStatus)
  status?: BOPISOrderStatus;

  @IsOptional()
  @IsDateString()
  readyForPickupDate?: string;

  @IsOptional()
  @IsDateString()
  pickedUpDate?: string;
}

