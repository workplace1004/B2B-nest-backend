import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateWarehouseDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsString()
  @IsOptional()
  postalCode?: string;

  @IsString()
  @IsOptional()
  tplReference?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

