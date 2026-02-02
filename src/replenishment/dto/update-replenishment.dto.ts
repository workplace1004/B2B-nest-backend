import { PartialType } from '@nestjs/mapped-types';
import { CreateReplenishmentDto } from './create-replenishment.dto';

export class UpdateReplenishmentDto extends PartialType(CreateReplenishmentDto) {}

