import { IsString, IsOptional, IsArray, IsEnum, IsBoolean, IsDateString } from 'class-validator';
import { ApiKeyType } from '@prisma/client';

export class CreateApiKeyDto {
  @IsString()
  name: string;

  @IsString()
  key: string;

  @IsEnum(ApiKeyType)
  type: ApiKeyType;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissions?: string[];

  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

