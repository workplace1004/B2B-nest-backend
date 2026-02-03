import { PartialType } from '@nestjs/mapped-types';
import { CreateCostSheetDto } from './create-cost-sheet.dto';

export class UpdateCostSheetDto extends PartialType(CreateCostSheetDto) {}

