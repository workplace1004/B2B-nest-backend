import { PartialType } from '@nestjs/mapped-types';
import { CreateBackorderDto } from './create-backorder.dto';

export class UpdateBackorderDto extends PartialType(CreateBackorderDto) {}

