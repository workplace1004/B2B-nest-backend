import { PartialType } from '@nestjs/mapped-types';
import { CreatePurchaseOrderWIPTrackingDto } from './create-purchase-order-wip-tracking.dto';

export class UpdatePurchaseOrderWIPTrackingDto extends PartialType(CreatePurchaseOrderWIPTrackingDto) {}

