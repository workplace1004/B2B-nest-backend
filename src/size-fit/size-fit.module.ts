import { Module } from '@nestjs/common';
import { SizeFitService } from './size-fit.service';
import { SizeFitController } from './size-fit.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SizeFitController],
  providers: [SizeFitService],
})
export class SizeFitModule {}

