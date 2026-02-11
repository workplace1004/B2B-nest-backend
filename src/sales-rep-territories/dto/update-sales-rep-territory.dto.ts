import { PartialType } from '@nestjs/mapped-types';
import { CreateSalesRepTerritoryDto } from './create-sales-rep-territory.dto';

export class UpdateSalesRepTerritoryDto extends PartialType(CreateSalesRepTerritoryDto) {}

