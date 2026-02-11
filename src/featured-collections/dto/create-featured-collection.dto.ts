import { IsInt } from 'class-validator';

export class CreateFeaturedCollectionDto {
  @IsInt()
  collectionId: number;
}

