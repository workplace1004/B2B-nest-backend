import { PartialType } from '@nestjs/mapped-types';
import { CreateSyncHealthDto } from './create-sync-health.dto';

export class UpdateSyncHealthDto extends PartialType(CreateSyncHealthDto) {}

