import { PartialType } from '@nestjs/mapped-types';
import { CreatePurchaseOrderApprovalDto } from './create-purchase-order-approval.dto';

export class UpdatePurchaseOrderApprovalDto extends PartialType(CreatePurchaseOrderApprovalDto) {}

