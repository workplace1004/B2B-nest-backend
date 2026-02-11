import { PartialType } from '@nestjs/mapped-types';
import { CreateSalesRepCommissionDto } from './create-sales-rep-commission.dto';

export class UpdateSalesRepCommissionDto extends PartialType(CreateSalesRepCommissionDto) {}

