import { Module } from '@nestjs/common';
import { ServiceCasesService } from './service-cases.service';
import { ServiceCasesController } from './service-cases.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ServiceCasesController],
  providers: [ServiceCasesService],
})
export class ServiceCasesModule {}

