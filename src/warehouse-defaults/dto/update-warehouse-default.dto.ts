import { PartialType } from '@nestjs/mapped-types';
import { CreateWarehouseDefaultDto } from './create-warehouse-default.dto';

export class UpdateWarehouseDefaultDto extends PartialType(CreateWarehouseDefaultDto) {}

