import { IsString, IsOptional, IsEnum, IsObject } from 'class-validator';

export enum IntegrationType {
  E_COMMERCE = 'E_COMMERCE',
  ACCOUNTING = 'ACCOUNTING',
  SHIPPING = 'SHIPPING',
  MARKETING = 'MARKETING',
  ANALYTICS = 'ANALYTICS',
  OTHER = 'OTHER',
}

export enum IntegrationStatus {
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED',
  PENDING = 'PENDING',
  ERROR = 'ERROR',
}

export class CreateIntegrationDto {
  @IsString()
  name: string;

  @IsEnum(IntegrationType)
  type: IntegrationType;

  @IsOptional()
  @IsEnum(IntegrationStatus)
  status?: IntegrationStatus;

  @IsOptional()
  @IsString()
  apiKey?: string;

  @IsOptional()
  @IsString()
  apiSecret?: string;

  @IsOptional()
  @IsObject()
  config?: Record<string, any>;

  @IsOptional()
  @IsString()
  notes?: string;
}

