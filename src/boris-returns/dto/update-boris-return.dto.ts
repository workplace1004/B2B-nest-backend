import { PartialType } from '@nestjs/mapped-types';
import { CreateBORISReturnDto, BORISReturnStatus } from './create-boris-return.dto';
import { IsEnum, IsOptional, IsDateString } from 'class-validator';

export class UpdateBORISReturnDto extends PartialType(CreateBORISReturnDto) {
  @IsOptional()
  @IsEnum(BORISReturnStatus)
  status?: BORISReturnStatus;

  @IsOptional()
  @IsDateString()
  receivedDate?: string;

  @IsOptional()
  @IsDateString()
  processedDate?: string;
}

