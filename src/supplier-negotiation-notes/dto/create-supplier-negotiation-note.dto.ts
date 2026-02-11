import { IsInt, IsString, IsOptional, IsDateString, IsArray } from 'class-validator';

export class CreateSupplierNegotiationNoteDto {
  @IsInt()
  supplierId: number;

  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsDateString()
  date: string;

  @IsOptional()
  @IsString()
  createdBy?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

