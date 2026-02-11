import { Module } from '@nestjs/common';
import { ChannelSyncService } from './channel-sync.service';
import { ChannelSyncScheduler } from './channel-sync.scheduler';
import { PrismaModule } from '../prisma/prisma.module';
import { SyncHealthModule } from '../sync-health/sync-health.module';

@Module({
  imports: [PrismaModule, SyncHealthModule],
  providers: [ChannelSyncService, ChannelSyncScheduler],
  exports: [ChannelSyncService],
})
export class ChannelSyncModule {}

