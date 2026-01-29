import { PartialType } from '@nestjs/mapped-types';
import { CreateDAMAssetDto } from './create-dam-asset.dto';

export class UpdateDAMAssetDto extends PartialType(CreateDAMAssetDto) {}

