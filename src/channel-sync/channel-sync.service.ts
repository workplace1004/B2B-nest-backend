import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SyncHealthService } from '../sync-health/sync-health.service';

export interface SyncResult {
  success: boolean;
  recordsSynced: number;
  recordsFailed: number;
  syncDuration: number;
  errorMessage?: string;
}

@Injectable()
export class ChannelSyncService {
  private readonly logger = new Logger(ChannelSyncService.name);

  constructor(
    private prisma: PrismaService,
    private syncHealthService: SyncHealthService,
  ) {}

  /**
   * Perform sync for a specific channel
   */
  async syncChannel(channelId: number): Promise<SyncResult> {
    const startTime = Date.now();

    // Get channel
    const channel = await this.prisma.integration.findUnique({
      where: { id: channelId },
    });

    if (!channel) {
      throw new NotFoundException(`Channel with ID ${channelId} not found`);
    }

    // Check if channel is connected
    if (channel.status !== 'CONNECTED') {
      throw new Error(`Channel ${channel.name} is not connected. Status: ${channel.status}`);
    }

    // Set status to SYNCING
    await this.syncHealthService.setSyncingStatus(channelId);

    try {
      // Perform actual sync operation
      // TODO: Replace this with actual sync logic based on channel type and provider
      const syncResult = await this.performSync(channel);

      const syncDuration = Math.floor((Date.now() - startTime) / 1000); // Duration in seconds

      // Update sync health with results
      await this.syncHealthService.updateSyncHealthAfterSync(channelId, {
        success: syncResult.success,
        recordsSynced: syncResult.recordsSynced,
        recordsFailed: syncResult.recordsFailed,
        syncDuration,
        errorMessage: syncResult.errorMessage,
      });

      // Update channel's lastSync timestamp
      await this.prisma.integration.update({
        where: { id: channelId },
        data: { lastSync: new Date() },
      });

      return {
        success: syncResult.success,
        recordsSynced: syncResult.recordsSynced,
        recordsFailed: syncResult.recordsFailed,
        syncDuration,
        errorMessage: syncResult.errorMessage,
      };
    } catch (error: any) {
      const syncDuration = Math.floor((Date.now() - startTime) / 1000);

      // Update sync health with error
      await this.syncHealthService.updateSyncHealthAfterSync(channelId, {
        success: false,
        recordsSynced: 0,
        recordsFailed: 0,
        syncDuration,
        errorMessage: error.message || 'Sync failed with unknown error',
      });

      throw error;
    }
  }

  /**
   * Perform the actual sync operation
   * This is a placeholder - replace with actual sync logic based on channel type/provider
   */
  private async performSync(channel: any): Promise<SyncResult> {
    // Simulate sync operation
    // In a real implementation, this would:
    // 1. Connect to the external service (Shopify, WooCommerce, etc.)
    // 2. Fetch data (products, orders, inventory, etc.)
    // 3. Transform and map the data
    // 4. Save to database
    // 5. Handle errors and track failures

    // For now, simulate a sync with random results
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000)); // 1-3 seconds

    const recordsSynced = Math.floor(Math.random() * 1000) + 100;
    const recordsFailed = Math.random() > 0.8 ? Math.floor(Math.random() * 10) : 0;
    const success = recordsFailed < recordsSynced * 0.1; // Success if less than 10% failed

    return {
      success,
      recordsSynced,
      recordsFailed,
      syncDuration: 0, // Will be calculated by caller
      errorMessage: success ? undefined : 'Some records failed to sync',
    };
  }

  /**
   * Sync all connected channels
   */
  async syncAllChannels(): Promise<{ channelId: number; result: SyncResult }[]> {
    const channels = await this.prisma.integration.findMany({
      where: { status: 'CONNECTED' },
    });

    const results = await Promise.allSettled(
      channels.map(async (channel) => {
        try {
          const result = await this.syncChannel(channel.id);
          return { channelId: channel.id, result };
        } catch (error: any) {
          return {
            channelId: channel.id,
            result: {
              success: false,
              recordsSynced: 0,
              recordsFailed: 0,
              syncDuration: 0,
              errorMessage: error.message,
            },
          };
        }
      }),
    );

    return results.map((r) => (r.status === 'fulfilled' ? r.value : r.reason));
  }

  /**
   * Get channels that are due for sync
   */
  async getChannelsDueForSync(): Promise<any[]> {
    const now = new Date();

    // Get all connected channels
    const channels = await this.prisma.integration.findMany({
      where: { status: 'CONNECTED' },
    });

    const channelsDueForSync = [];

    for (const channel of channels) {
      try {
        let syncHealth;
        try {
          syncHealth = await this.syncHealthService.findByChannelId(channel.id);
        } catch (error) {
          // If sync health doesn't exist, create it and mark channel as due for sync
          const notes = (channel.notes as string) || '';
          const syncFreqMatch = notes.match(/Sync Frequency: (.+)/i);
          const syncFrequency = syncFreqMatch ? syncFreqMatch[1] : undefined;
          await this.syncHealthService.upsertSyncHealth(channel.id, channel.name, syncFrequency);
          channelsDueForSync.push(channel);
          continue;
        }
        
        // Check if nextSync time has passed
        if (syncHealth.nextSync) {
          const nextSyncTime = new Date(syncHealth.nextSync);
          if (nextSyncTime <= now) {
            channelsDueForSync.push(channel);
          }
        } else {
          // If no nextSync set, check if lastSync is old (more than 1 hour ago)
          if (!syncHealth.lastSync) {
            channelsDueForSync.push(channel);
          } else {
            const lastSyncTime = new Date(syncHealth.lastSync);
            const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
            if (lastSyncTime <= oneHourAgo) {
              channelsDueForSync.push(channel);
            }
          }
        }
      } catch (error) {
        // If any error occurs, mark channel as due for sync to ensure it gets processed
        this.logger.error(`Error checking sync status for channel ${channel.id}: ${error}`);
        channelsDueForSync.push(channel);
      }
    }

    return channelsDueForSync;
  }
}

