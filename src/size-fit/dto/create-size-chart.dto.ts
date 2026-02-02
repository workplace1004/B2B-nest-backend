import { IsString, IsOptional, IsObject, IsBoolean } from 'class-validator';

export class CreateSizeChartDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsObject()
  measurements: Record<string, Record<string, string | number>>;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

