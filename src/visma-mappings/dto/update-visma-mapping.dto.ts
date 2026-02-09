import { PartialType } from '@nestjs/mapped-types';
import { CreateVismaMappingDto } from './create-visma-mapping.dto';

export class UpdateVismaMappingDto extends PartialType(CreateVismaMappingDto) {}

