import { PartialType } from '@nestjs/mapped-types';
import { CreateTaxDefaultDto } from './create-tax-default.dto';

export class UpdateTaxDefaultDto extends PartialType(CreateTaxDefaultDto) {}

