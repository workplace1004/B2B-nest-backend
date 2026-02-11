import { Module } from '@nestjs/common';
import { PickListsService } from './pick-lists.service';
import { PickListsController } from './pick-lists.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PickListsController],
  providers: [PickListsService],
  exports: [PickListsService],
})
export class PickListsModule {}

