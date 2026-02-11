import { Module } from '@nestjs/common';
import { BORISReturnsService } from './boris-returns.service';
import { BORISReturnsController } from './boris-returns.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BORISReturnsController],
  providers: [BORISReturnsService],
  exports: [BORISReturnsService],
})
export class BORISReturnsModule {}

