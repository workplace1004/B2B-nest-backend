import { PartialType, OmitType } from '@nestjs/mapped-types';
import { IsOptional, IsArray, ValidateNested, IsString, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateBOMDto, CreateBOMComponentDto, BOMStatus } from './create-bom.dto';

export class UpdateBOMComponentDto extends PartialType(CreateBOMComponentDto) {}

export class UpdateBOMDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(BOMStatus)
  status?: BOMStatus;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateBOMComponentDto)
  components?: UpdateBOMComponentDto[];
}

