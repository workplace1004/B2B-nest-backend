import { IsNumber, IsString, IsEnum, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus, OrderType } from '@prisma/client';

class OrderLineDto {
  @IsNumber()
  productId: number;

  @IsNumber()
  quantity: number;

  @IsNumber()
  unitPrice: number;

  @IsString()
  @IsOptional()
  size?: string;

  @IsString()
  @IsOptional()
  color?: string;
}

export class CreateOrderDto {
  @IsNumber()
  customerId: number;

  @IsNumber()
  @IsOptional()
  userId?: number;

  @IsEnum(OrderType)
  @IsOptional()
  type?: OrderType;

  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  shippingAddress?: string;

  @IsString()
  @IsOptional()
  billingAddress?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderLineDto)
  orderLines: OrderLineDto[];
}

