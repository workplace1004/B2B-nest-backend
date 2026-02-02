import { IsString, IsOptional, IsEnum, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export enum BOMStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
}

export class CreateBOMComponentDto {
  @IsOptional()
  productId?: number;

  @IsString()
  name: string;

  @IsOptional()
  quantity?: number;

  @IsOptional()
  @IsString()
  unit?: string;

  @IsOptional()
  cost?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateBOMDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsEnum(BOMStatus)
  status?: BOMStatus;

  @IsOptional()
  @IsString()
  description?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateBOMComponentDto)
  components: CreateBOMComponentDto[];
}

