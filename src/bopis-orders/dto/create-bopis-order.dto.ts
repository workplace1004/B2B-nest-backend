import { IsString, IsNumber, IsOptional, IsEnum, IsDateString, IsArray, ValidateNested, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export enum BOPISOrderStatus {
  PENDING = 'PENDING',
  READY_FOR_PICKUP = 'READY_FOR_PICKUP',
  PICKED_UP = 'PICKED_UP',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
}

export class CreateBOPISOrderItemDto {
  @IsNumber()
  orderLineId: number;

  @IsNumber()
  productId: number;

  @IsNumber()
  quantity: number;

  @IsNumber()
  unitPrice: number;

  @IsNumber()
  totalPrice: number;

  @IsOptional()
  @IsString()
  size?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsBoolean()
  isReady?: boolean;

  @IsOptional()
  @IsDateString()
  readyAt?: string;
}

export class CreateBOPISOrderDto {
  @IsNumber()
  orderId: number;

  @IsString()
  orderNumber: string;

  @IsNumber()
  customerId: number;

  @IsNumber()
  storeId: number;

  @IsOptional()
  @IsEnum(BOPISOrderStatus)
  status?: BOPISOrderStatus;

  @IsOptional()
  @IsDateString()
  orderDate?: string;

  @IsOptional()
  @IsDateString()
  readyForPickupDate?: string;

  @IsOptional()
  @IsDateString()
  pickedUpDate?: string;

  @IsOptional()
  @IsDateString()
  expiryDate?: string;

  @IsOptional()
  @IsString()
  pickupInstructions?: string;

  @IsOptional()
  @IsString()
  customerNotes?: string;

  @IsOptional()
  @IsNumber()
  totalAmount?: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateBOPISOrderItemDto)
  items: CreateBOPISOrderItemDto[];
}

