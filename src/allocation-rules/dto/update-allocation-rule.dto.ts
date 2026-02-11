import { PartialType } from '@nestjs/mapped-types';
import { CreateAllocationRuleDto } from './create-allocation-rule.dto';

export class UpdateAllocationRuleDto extends PartialType(CreateAllocationRuleDto) {}

