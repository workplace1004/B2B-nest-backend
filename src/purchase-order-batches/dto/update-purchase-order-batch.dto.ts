import { PartialType } from '@nestjs/mapped-types';
import { CreatePurchaseOrderBatchDto } from './create-purchase-order-batch.dto';

export class UpdatePurchaseOrderBatchDto extends PartialType(CreatePurchaseOrderBatchDto) {}

