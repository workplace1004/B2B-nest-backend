import { Module } from '@nestjs/common';
import { CountingService } from './counting.service';
import { CountingController } from './counting.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CountingController],
  providers: [CountingService],
  exports: [CountingService],
})
export class CountingModule {}

