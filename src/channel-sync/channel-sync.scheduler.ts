import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ChannelSyncService } from './channel-sync.service';

@Injectable()
export class ChannelSyncScheduler implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ChannelSyncScheduler.name);
  private syncInterval: NodeJS.Timeout | null = null;
  private readonly CHECK_INTERVAL = 60000; // Check every minute

  constructor(private readonly channelSyncService: ChannelSyncService) {}

  onModuleInit() {
    this.logger.log('Channel Sync Scheduler initialized');
    this.startScheduler();
  }

  onModuleDestroy() {
    this.stopScheduler();
  }

  /**
   * Start the automatic sync scheduler
   */
  private startScheduler() {
    this.logger.log('Starting automatic channel sync scheduler...');
    
    // Run initial check after 30 seconds
    setTimeout(() => {
      this.checkAndSyncChannels();
    }, 30000);

    // Then check every minute
    this.syncInterval = setInterval(() => {
      this.checkAndSyncChannels();
    }, this.CHECK_INTERVAL);
  }

  /**
   * Stop the scheduler
   */
  private stopScheduler() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
      this.logger.log('Channel Sync Scheduler stopped');
    }
  }

  /**
   * Check for channels due for sync and sync them
   */
  private async checkAndSyncChannels() {
    try {
      const channelsDueForSync = await this.channelSyncService.getChannelsDueForSync();

      if (channelsDueForSync.length === 0) {
        this.logger.debug('No channels due for sync');
        return;
      }

      this.logger.log(`Found ${channelsDueForSync.length} channel(s) due for sync`);

      // Sync each channel
      for (const channel of channelsDueForSync) {
        try {
          this.logger.log(`Starting sync for channel: ${channel.name} (ID: ${channel.id})`);
          const result = await this.channelSyncService.syncChannel(channel.id);
          
          if (result.success) {
            this.logger.log(
              `Sync completed for channel ${channel.name}: ${result.recordsSynced} records synced, ${result.recordsFailed} failed`,
            );
          } else {
            this.logger.warn(
              `Sync completed with errors for channel ${channel.name}: ${result.errorMessage}`,
            );
          }
        } catch (error: any) {
          this.logger.error(
            `Failed to sync channel ${channel.name} (ID: ${channel.id}): ${error.message}`,
          );
        }
      }
    } catch (error: any) {
      this.logger.error(`Error in sync scheduler: ${error.message}`);
    }
  }

  /**
   * Manually trigger sync check (for testing or manual triggers)
   */
  async triggerSyncCheck() {
    this.logger.log('Manual sync check triggered');
    await this.checkAndSyncChannels();
  }
}

