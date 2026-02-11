import { PartialType } from '@nestjs/mapped-types';
import { CreateEndlessAisleProductDto } from './create-endless-aisle-product.dto';

export class UpdateEndlessAisleProductDto extends PartialType(CreateEndlessAisleProductDto) {}

