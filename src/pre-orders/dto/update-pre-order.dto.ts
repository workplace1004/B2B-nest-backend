import { PartialType } from '@nestjs/mapped-types';
import { CreatePreOrderDto } from './create-pre-order.dto';

export class UpdatePreOrderDto extends PartialType(CreatePreOrderDto) {}

