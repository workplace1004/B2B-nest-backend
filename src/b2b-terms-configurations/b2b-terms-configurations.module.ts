import { Module } from '@nestjs/common';
import { B2BTermsConfigurationsService } from './b2b-terms-configurations.service';
import { B2BTermsConfigurationsController } from './b2b-terms-configurations.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [B2BTermsConfigurationsController],
  providers: [B2BTermsConfigurationsService],
})
export class B2BTermsConfigurationsModule {}

