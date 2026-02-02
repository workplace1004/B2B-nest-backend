import { PartialType } from '@nestjs/mapped-types';
import { CreateBOMDto } from './create-bom.dto';

export class UpdateBOMDto extends PartialType(CreateBOMDto) {}

