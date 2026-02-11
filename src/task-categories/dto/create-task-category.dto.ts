import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateTaskCategoryDto {
  @IsString()
  name: string;

  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
}

