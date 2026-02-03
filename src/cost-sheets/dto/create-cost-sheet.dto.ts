import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCostSheetDto {
  @IsNumber()
  @IsOptional()
  materials?: number;

  @IsNumber()
  @IsOptional()
  labor?: number;

  @IsNumber()
  @IsOptional()
  overhead?: number;

  @IsNumber()
  @IsOptional()
  sellingPrice?: number;

  @IsString()
  @IsOptional()
  notes?: string;
}

