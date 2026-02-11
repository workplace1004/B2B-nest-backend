import { Module } from '@nestjs/common';
import { FeaturedCollectionsService } from './featured-collections.service';
import { FeaturedCollectionsController } from './featured-collections.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FeaturedCollectionsController],
  providers: [FeaturedCollectionsService],
})
export class FeaturedCollectionsModule {}

