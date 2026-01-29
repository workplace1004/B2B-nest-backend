import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { OrderStatus } from '@prisma/client';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;
}

