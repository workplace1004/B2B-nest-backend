import { IsString, IsOptional, IsArray, IsBoolean } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsArray()
  @IsString({ each: true })
  permissions: string[];

  @IsOptional()
  @IsBoolean()
  isSystemRole?: boolean;
}

