import { Module } from '@nestjs/common';
import { VismaFieldsService } from './visma-fields.service';
import { VismaFieldsController } from './visma-fields.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [VismaFieldsController],
  providers: [VismaFieldsService],
  exports: [VismaFieldsService],
})
export class VismaFieldsModule {}

