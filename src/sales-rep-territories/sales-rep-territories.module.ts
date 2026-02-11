import { Module } from '@nestjs/common';
import { SalesRepTerritoriesService } from './sales-rep-territories.service';
import { SalesRepTerritoriesController } from './sales-rep-territories.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SalesRepTerritoriesController],
  providers: [SalesRepTerritoriesService],
})
export class SalesRepTerritoriesModule {}

