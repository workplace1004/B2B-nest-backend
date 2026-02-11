import { PartialType } from '@nestjs/mapped-types';
import { CreatePartialShipmentDto } from './create-partial-shipment.dto';

export class UpdatePartialShipmentDto extends PartialType(CreatePartialShipmentDto) {}

