import { IsString, IsEnum, IsArray, IsNumber, IsOptional } from 'class-validator';
import { AssetType } from '@prisma/client';

export class CreateDAMAssetDto {
  @IsNumber()
  @IsOptional()
  productId?: number;

  @IsString()
  name: string;

  @IsEnum(AssetType)
  @IsOptional()
  type?: AssetType;

  @IsString()
  url: string;

  @IsString()
  @IsOptional()
  thumbnailUrl?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsNumber()
  @IsOptional()
  fileSize?: number;

  @IsString()
  @IsOptional()
  mimeType?: string;
}

