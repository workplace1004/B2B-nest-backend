import { Module } from '@nestjs/common';
import { DataImportsService } from './data-imports.service';
import { DataImportsController } from './data-imports.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DataImportsController],
  providers: [DataImportsService],
  exports: [DataImportsService],
})
export class DataImportsModule {}

