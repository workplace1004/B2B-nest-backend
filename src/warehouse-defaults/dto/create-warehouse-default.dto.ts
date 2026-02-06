import { IsString, IsOptional, IsInt, IsEnum, IsBoolean } from 'class-validator';
import { WarehouseDefaultStatus } from '@prisma/client';

export class CreateWarehouseDefaultDto {
  @IsString()
  name: string;

  @IsString()
  code: string;

  @IsString()
  address: string;

  @IsString()
  city: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsString()
  country: string;

  @IsString()
  postalCode: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  @IsOptional()
  @IsEnum(WarehouseDefaultStatus)
  status?: WarehouseDefaultStatus;

  @IsOptional()
  @IsInt()
  capacity?: number;

  @IsOptional()
  @IsString()
  description?: string;
}

