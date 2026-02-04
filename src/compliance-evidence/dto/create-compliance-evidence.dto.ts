import { IsString, IsNumber, IsOptional, IsArray, IsDateString, IsEnum, IsBoolean } from 'class-validator';
import { ComplianceEvidenceType } from '@prisma/client';

export class CreateComplianceEvidenceDto {
  @IsNumber()
  @IsOptional()
  productId?: number;

  @IsString()
  name: string;

  @IsEnum(ComplianceEvidenceType)
  @IsOptional()
  type?: ComplianceEvidenceType;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  documentUrl?: string;

  @IsString()
  @IsOptional()
  issuer?: string;

  @IsDateString()
  @IsOptional()
  issueDate?: string;

  @IsDateString()
  @IsOptional()
  expiryDate?: string;

  @IsString()
  @IsOptional()
  certificateNumber?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  standards?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}



