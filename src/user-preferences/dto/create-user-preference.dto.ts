import { IsString, IsOptional, IsInt } from 'class-validator';

export class CreateUserPreferenceDto {
  @IsInt()
  @IsOptional()
  userId?: number;

  @IsString()
  key: string;

  @IsString()
  value: string;
}

