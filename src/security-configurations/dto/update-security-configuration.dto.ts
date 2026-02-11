import { IsEnum, IsNotEmpty } from 'class-validator';
import { SecurityConfigurationType } from '@prisma/client';

export class UpdateSecurityConfigurationDto {
  @IsEnum(SecurityConfigurationType)
  @IsNotEmpty()
  type: SecurityConfigurationType;

  @IsNotEmpty()
  data: any; // JSON data
}

