import { PartialType } from '@nestjs/mapped-types';
import { CreateComplianceEvidenceDto } from './create-compliance-evidence.dto';

export class UpdateComplianceEvidenceDto extends PartialType(CreateComplianceEvidenceDto) {}

