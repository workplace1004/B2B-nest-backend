import { IsString, IsEmail, IsEnum, IsOptional, IsNumber } from 'class-validator';
import { CustomerType } from '@prisma/client';

export class CreateCustomerDto {
  @IsString()
  name: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  contactPerson?: string;

  @IsEnum(CustomerType)
  @IsOptional()
  type?: CustomerType;

  @IsString()
  @IsOptional()
  companyName?: string;

  @IsString()
  @IsOptional()
  taxId?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsString()
  @IsOptional()
  postalCode?: string;

  @IsNumber()
  @IsOptional()
  creditLimit?: number;

  @IsNumber()
  @IsOptional()
  ownerId?: number;
}

