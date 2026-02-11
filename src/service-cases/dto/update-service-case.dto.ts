import { PartialType } from '@nestjs/mapped-types';
import { CreateServiceCaseDto } from './create-service-case.dto';

export class UpdateServiceCaseDto extends PartialType(CreateServiceCaseDto) {}

