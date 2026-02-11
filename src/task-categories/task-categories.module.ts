import { Module } from '@nestjs/common';
import { TaskCategoriesController } from './task-categories.controller';
import { TaskCategoriesService } from './task-categories.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TaskCategoriesController],
  providers: [TaskCategoriesService],
  exports: [TaskCategoriesService],
})
export class TaskCategoriesModule {}

