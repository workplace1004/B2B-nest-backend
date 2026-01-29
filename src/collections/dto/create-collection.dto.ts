import { IsString, IsEnum, IsOptional } from 'class-validator';
import { CollectionLifecycle } from '@prisma/client';

export class CreateCollectionDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  season?: string;

  @IsString()
  @IsOptional()
  drop?: string;

  @IsEnum(CollectionLifecycle)
  @IsOptional()
  lifecycle?: CollectionLifecycle;

  @IsString()
  @IsOptional()
  description?: string;
}

