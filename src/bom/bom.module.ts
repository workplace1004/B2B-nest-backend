import { Module } from '@nestjs/common';
import { BOMService } from './bom.service';
import { BOMController } from './bom.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BOMController],
  providers: [BOMService],
  exports: [BOMService],
})
export class BOMModule {}

