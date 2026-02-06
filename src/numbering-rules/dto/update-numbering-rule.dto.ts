import { PartialType } from '@nestjs/mapped-types';
import { CreateNumberingRuleDto } from './create-numbering-rule.dto';

export class UpdateNumberingRuleDto extends PartialType(CreateNumberingRuleDto) {}

