import { Module } from '@nestjs/common';
import { SalesRepCommissionsService } from './sales-rep-commissions.service';
import { SalesRepCommissionsController } from './sales-rep-commissions.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SalesRepCommissionsController],
  providers: [SalesRepCommissionsService],
})
export class SalesRepCommissionsModule {}

