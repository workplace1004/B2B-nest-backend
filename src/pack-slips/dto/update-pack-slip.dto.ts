import { PartialType } from '@nestjs/mapped-types';
import { CreatePackSlipDto } from './create-pack-slip.dto';

export class UpdatePackSlipDto extends PartialType(CreatePackSlipDto) {}

