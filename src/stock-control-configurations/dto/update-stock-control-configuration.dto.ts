import { IsEnum, IsNotEmpty } from 'class-validator';
import { StockControlConfigurationType } from '@prisma/client';

export class UpdateStockControlConfigurationDto {
  @IsEnum(StockControlConfigurationType)
  @IsNotEmpty()
  type: StockControlConfigurationType;

  @IsNotEmpty()
  data: any; // JSON data
}

