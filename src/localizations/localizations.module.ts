import { Module } from '@nestjs/common';
import { LocalizationsService } from './localizations.service';
import { LocalizationsController } from './localizations.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [LocalizationsController],
  providers: [LocalizationsService],
  exports: [LocalizationsService],
})
export class LocalizationsModule {}

