import { IsInt, IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';

export enum ReverseLogisticsStatus {
  PENDING = 'PENDING',
  IN_TRANSIT = 'IN_TRANSIT',
  RECEIVED = 'RECEIVED',
  INSPECTED = 'INSPECTED',
  PROCESSED = 'PROCESSED',
  CANCELLED = 'CANCELLED',
}

export class CreateReverseLogisticsDto {
  @IsInt()
  rmaId: number;

  @IsOptional()
  @IsString()
  trackingNumber?: string;

  @IsOptional()
  @IsString()
  carrier?: string;

  @IsOptional()
  @IsEnum(ReverseLogisticsStatus)
  status?: ReverseLogisticsStatus;

  @IsOptional()
  @IsString()
  originName?: string;

  @IsOptional()
  @IsString()
  originAddress?: string;

  @IsOptional()
  @IsString()
  originCity?: string;

  @IsOptional()
  @IsString()
  originState?: string;

  @IsOptional()
  @IsString()
  originPostalCode?: string;

  @IsOptional()
  @IsString()
  originCountry?: string;

  @IsOptional()
  @IsString()
  destinationName?: string;

  @IsOptional()
  @IsString()
  destinationAddress?: string;

  @IsOptional()
  @IsString()
  destinationCity?: string;

  @IsOptional()
  @IsString()
  destinationState?: string;

  @IsOptional()
  @IsString()
  destinationPostalCode?: string;

  @IsOptional()
  @IsString()
  destinationCountry?: string;

  @IsOptional()
  @IsDateString()
  shippedDate?: string;

  @IsOptional()
  @IsDateString()
  receivedDate?: string;

  @IsOptional()
  @IsDateString()
  inspectedDate?: string;

  @IsOptional()
  @IsDateString()
  processedDate?: string;

  @IsOptional()
  @IsDateString()
  estimatedDeliveryDate?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

