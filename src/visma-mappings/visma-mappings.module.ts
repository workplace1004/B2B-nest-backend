import { Module } from '@nestjs/common';
import { VismaMappingsService } from './visma-mappings.service';
import { VismaMappingsController } from './visma-mappings.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [VismaMappingsController],
  providers: [VismaMappingsService],
  exports: [VismaMappingsService],
})
export class VismaMappingsModule {}

