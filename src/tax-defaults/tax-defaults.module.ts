import { Module } from '@nestjs/common';
import { TaxDefaultsService } from './tax-defaults.service';
import { TaxDefaultsController } from './tax-defaults.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TaxDefaultsController],
  providers: [TaxDefaultsService],
  exports: [TaxDefaultsService],
})
export class TaxDefaultsModule {}

