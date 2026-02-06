import { IsString, IsOptional, IsInt, IsEnum } from 'class-validator';
import { NumberingRuleType, NumberingRuleStatus } from '@prisma/client';

export class CreateNumberingRuleDto {
  @IsString()
  name: string;

  @IsEnum(NumberingRuleType)
  type: NumberingRuleType;

  @IsOptional()
  @IsString()
  prefix?: string;

  @IsOptional()
  @IsString()
  suffix?: string;

  @IsOptional()
  @IsInt()
  length?: number;

  @IsOptional()
  @IsInt()
  sequenceStart?: number;

  @IsString()
  format: string;

  @IsOptional()
  @IsEnum(NumberingRuleStatus)
  status?: NumberingRuleStatus;

  @IsOptional()
  @IsString()
  description?: string;
}

