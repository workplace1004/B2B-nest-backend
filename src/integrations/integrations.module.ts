import { Module } from '@nestjs/common';
import { IntegrationsService } from './integrations.service';
import { IntegrationsController } from './integrations.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { SyncHealthModule } from '../sync-health/sync-health.module';
import { ChannelSyncModule } from '../channel-sync/channel-sync.module';

@Module({
  imports: [PrismaModule, SyncHealthModule, ChannelSyncModule],
  controllers: [IntegrationsController],
  providers: [IntegrationsService],
  exports: [IntegrationsService],
})
export class IntegrationsModule {}

