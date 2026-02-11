import { PartialType } from '@nestjs/mapped-types';
import { CreatePickListDto } from './create-pick-list.dto';

export class UpdatePickListDto extends PartialType(CreatePickListDto) {}

