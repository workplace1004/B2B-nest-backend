import { IsEnum, IsNotEmpty } from 'class-validator';
import { WarehouseConfigurationType } from '@prisma/client';

export class UpdateWarehouseConfigurationDto {
  @IsEnum(WarehouseConfigurationType)
  @IsNotEmpty()
  type: WarehouseConfigurationType;

  @IsNotEmpty()
  data: any; // JSON data
}

