import { IsEnum, IsNotEmpty } from 'class-validator';
import { ProductConfigurationType } from '@prisma/client';

export class UpdateProductConfigurationDto {
  @IsEnum(ProductConfigurationType)
  @IsNotEmpty()
  type: ProductConfigurationType;

  @IsNotEmpty()
  data: any; // JSON data
}

