import { PartialType } from '@nestjs/mapped-types';
import { CreateSupplierPriceHistoryDto } from './create-supplier-price-history.dto';

export class UpdateSupplierPriceHistoryDto extends PartialType(CreateSupplierPriceHistoryDto) {}

