import { IsString, IsOptional, IsEnum, IsObject, IsNumber } from 'class-validator';

export enum RuleType {
  INVENTORY = 'INVENTORY',
  PRICING = 'PRICING',
  ORDER = 'ORDER',
  ALERT = 'ALERT',
  AUTOMATION = 'AUTOMATION',
  OTHER = 'OTHER',
}

export enum RuleStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DRAFT = 'DRAFT',
}

export class CreateRuleDto {
  @IsString()
  name: string;

  @IsEnum(RuleType)
  type: RuleType;

  @IsOptional()
  @IsEnum(RuleStatus)
  status?: RuleStatus;

  @IsOptional()
  @IsString()
  description?: string;

  @IsObject()
  conditions: Record<string, any>;

  @IsObject()
  actions: Record<string, any>;

  @IsOptional()
  @IsNumber()
  priority?: number;
}

