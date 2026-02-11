import { PartialType } from '@nestjs/mapped-types';
import { CreateScanHistoryDto } from './create-scan-history.dto';

export class UpdateScanHistoryDto extends PartialType(CreateScanHistoryDto) {}

