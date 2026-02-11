import { PartialType } from '@nestjs/mapped-types';
import { CreateFeaturedCollectionDto } from './create-featured-collection.dto';

export class UpdateFeaturedCollectionDto extends PartialType(CreateFeaturedCollectionDto) {}

