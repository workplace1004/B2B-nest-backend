import { Module } from '@nestjs/common';
import { MarkdownPlansService } from './markdown-plans.service';
import { MarkdownPlansController } from './markdown-plans.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MarkdownPlansController],
  providers: [MarkdownPlansService],
})
export class MarkdownPlansModule {}

