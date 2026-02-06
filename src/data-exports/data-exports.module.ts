import { Module } from '@nestjs/common';
import { DataExportsService } from './data-exports.service';
import { DataExportsController } from './data-exports.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DataExportsController],
  providers: [DataExportsService],
  exports: [DataExportsService],
})
export class DataExportsModule {}

