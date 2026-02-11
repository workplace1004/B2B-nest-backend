import { IsNotEmpty, IsString, IsNumber, IsEnum, IsOptional, IsBoolean, IsObject } from 'class-validator';

export enum AllocationMethod {
  FIFO = 'FIFO',
  LIFO = 'LIFO',
  PRIORITY = 'PRIORITY',
  ROUND_ROBIN = 'ROUND_ROBIN',
  PROXIMITY = 'PROXIMITY',
}

export enum AllocationChannel {
  DTC = 'DTC',
  POS = 'POS',
  B2B = 'B2B',
  WHOLESALE = 'WHOLESALE',
  ALL = 'ALL',
}

export class CreateAllocationRuleDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  priority?: number;

  @IsOptional()
  @IsEnum(AllocationChannel)
  channel?: AllocationChannel;

  @IsOptional()
  @IsNumber()
  customerId?: number;

  @IsOptional()
  @IsEnum(['RETAILER', 'B2B', 'WHOLESALE'])
  customerType?: string;

  @IsOptional()
  @IsNumber()
  warehouseId?: number;

  @IsOptional()
  @IsEnum(AllocationMethod)
  allocationMethod?: AllocationMethod;

  @IsOptional()
  @IsObject()
  conditions?: {
    minOrderValue?: number;
    maxOrderValue?: number;
    productCategory?: string;
    orderType?: string[];
  };

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

