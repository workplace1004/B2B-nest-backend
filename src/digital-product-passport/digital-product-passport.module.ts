import { Module } from '@nestjs/common';
import { DigitalProductPassportService } from './digital-product-passport.service';
import { DigitalProductPassportController } from './digital-product-passport.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DigitalProductPassportController],
  providers: [DigitalProductPassportService],
  exports: [DigitalProductPassportService],
})
export class DigitalProductPassportModule {}

