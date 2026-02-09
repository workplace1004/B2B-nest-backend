import { IsString, IsOptional, IsEnum } from 'class-validator';

export enum MappingStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
}

export enum SyncDirection {
  EXPORT = 'export',
  IMPORT = 'import',
  BIDIRECTIONAL = 'bidirectional',
}

export enum Transformation {
  NONE = 'none',
  UPPERCASE = 'uppercase',
  LOWERCASE = 'lowercase',
  TRIM = 'trim',
}

export class CreateVismaMappingDto {
  @IsString()
  name: string;

  @IsString()
  sourceField: string;

  @IsString()
  targetField: string;

  @IsOptional()
  @IsEnum(SyncDirection)
  syncDirection?: SyncDirection;

  @IsOptional()
  @IsEnum(Transformation)
  transformation?: Transformation;

  @IsOptional()
  @IsEnum(MappingStatus)
  status?: MappingStatus;
}

