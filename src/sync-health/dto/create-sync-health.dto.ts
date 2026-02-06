import { IsInt, IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { SyncStatus } from '@prisma/client';

export class CreateSyncHealthDto {
  @IsInt()
  channelId: number;

  @IsString()
  channelName: string;

  @IsOptional()
  @IsEnum(SyncStatus)
  status?: SyncStatus;

  @IsOptional()
  @IsDateString()
  lastSync?: string;

  @IsOptional()
  @IsDateString()
  nextSync?: string;

  @IsOptional()
  @IsInt()
  recordsSynced?: number;

  @IsOptional()
  @IsInt()
  recordsFailed?: number;

  @IsOptional()
  @IsInt()
  syncDuration?: number;

  @IsOptional()
  @IsString()
  errorMessage?: string;
}

