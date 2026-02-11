import { IsString, IsOptional, IsInt, IsBoolean, IsArray } from 'class-validator';

export class CreateSalesRepTerritoryDto {
  @IsInt()
  userId: number;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  region?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  countries?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  states?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  cities?: string[];

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

