import { IsString, IsOptional, IsInt, IsEnum, IsArray, ValidateNested, IsDateString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { QuoteStatus } from '@prisma/client';

export class CreateQuoteLineDto {
  @IsInt()
  productId: number;

  @IsInt()
  quantity: number;

  @IsNumber()
  unitPrice: number;

  @IsNumber()
  totalPrice: number;

  @IsString()
  @IsOptional()
  size?: string;

  @IsString()
  @IsOptional()
  color?: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class CreateQuoteDto {
  @IsString()
  quoteNumber: string;

  @IsInt()
  customerId: number;

  @IsInt()
  @IsOptional()
  userId?: number;

  @IsEnum(QuoteStatus)
  @IsOptional()
  status?: QuoteStatus;

  @IsDateString()
  @IsOptional()
  validUntil?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuoteLineDto)
  lines: CreateQuoteLineDto[];
}

