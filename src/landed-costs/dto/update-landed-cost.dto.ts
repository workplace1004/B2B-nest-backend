import { PartialType } from '@nestjs/mapped-types';
import { CreateLandedCostDto } from './create-landed-cost.dto';

export class UpdateLandedCostDto extends PartialType(CreateLandedCostDto) {}

