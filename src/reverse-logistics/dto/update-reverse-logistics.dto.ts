import { PartialType } from '@nestjs/mapped-types';
import { CreateReverseLogisticsDto } from './create-reverse-logistics.dto';

export class UpdateReverseLogisticsDto extends PartialType(CreateReverseLogisticsDto) {}

