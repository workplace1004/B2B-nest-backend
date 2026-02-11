import { Module } from '@nestjs/common';
import { SecurityConfigurationsService } from './security-configurations.service';
import { SecurityConfigurationsController } from './security-configurations.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SecurityConfigurationsController],
  providers: [SecurityConfigurationsService],
})
export class SecurityConfigurationsModule {}

