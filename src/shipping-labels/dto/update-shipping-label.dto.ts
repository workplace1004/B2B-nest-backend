import { PartialType } from '@nestjs/mapped-types';
import { CreateShippingLabelDto } from './create-shipping-label.dto';

export class UpdateShippingLabelDto extends PartialType(CreateShippingLabelDto) {}

