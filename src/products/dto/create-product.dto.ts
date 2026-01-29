import { IsString, IsNumber, IsArray, IsOptional, IsDecimal } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  sku: string;

  @IsString()
  @IsOptional()
  style?: string;

  @IsArray()
  @IsString({ each: true })
  sizes: string[];

  @IsArray()
  @IsString({ each: true })
  colors: string[];

  @IsArray()
  @IsString({ each: true })
  materials: string[];

  @IsString()
  @IsOptional()
  ean?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  basePrice?: number;

  @IsNumber()
  collectionId: number;
}

