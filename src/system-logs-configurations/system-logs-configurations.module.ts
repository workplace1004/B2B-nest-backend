import { Module } from '@nestjs/common';
import { SystemLogsConfigurationsService } from './system-logs-configurations.service';
import { SystemLogsConfigurationsController } from './system-logs-configurations.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SystemLogsConfigurationsController],
  providers: [SystemLogsConfigurationsService],
})
export class SystemLogsConfigurationsModule {}

