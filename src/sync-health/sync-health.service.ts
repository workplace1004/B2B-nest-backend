import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSyncHealthDto } from './dto/create-sync-health.dto';
import { UpdateSyncHealthDto } from './dto/update-sync-health.dto';
import { SyncStatus } from '@prisma/client';

@Injectable()
export class SyncHealthService {
  constructor(private prisma: PrismaService) {}

  async create(createSyncHealthDto: CreateSyncHealthDto) {
    // Check if sync health already exists for this channel
    const existing = await this.prisma.syncHealth.findUnique({
      where: { channelId: createSyncHealthDto.channelId },
    });

    if (existing) {
      throw new BadRequestException('Sync health already exists for this channel');
    }

    // Create sync health
    const syncHealth = await this.prisma.syncHealth.create({
      data: {
        ...createSyncHealthDto,
        lastSync: createSyncHealthDto.lastSync ? new Date(createSyncHealthDto.lastSync) : null,
        nextSync: createSyncHealthDto.nextSync ? new Date(createSyncHealthDto.nextSync) : null,
        recordsSynced: createSyncHealthDto.recordsSynced || 0,
        recordsFailed: createSyncHealthDto.recordsFailed || 0,
        status: createSyncHealthDto.status || 'HEALTHY',
      },
    });

    return this.mapSyncHealth(syncHealth);
  }

  async findAll(skip?: number, take?: number, status?: string) {
    const where: any = {};
    if (status && status !== 'all') {
      where.status = status.toUpperCase() as any;
    }

    const [data, total] = await Promise.all([
      this.prisma.syncHealth.findMany({
        skip: skip,
        take: take,
        where,
        orderBy: { lastSync: 'desc' },
      }),
      this.prisma.syncHealth.count({ where }),
    ]);

    const syncHealth = data.map((health) => this.mapSyncHealth(health));

    return {
      data: syncHealth,
      total,
      skip: skip || 0,
      take: take || syncHealth.length,
    };
  }

  async findOne(id: number) {
    const syncHealth = await this.prisma.syncHealth.findUnique({
      where: { id },
    });

    if (!syncHealth) {
      throw new NotFoundException(`Sync health with ID ${id} not found`);
    }

    return this.mapSyncHealth(syncHealth);
  }

  async findByChannelId(channelId: number) {
    const syncHealth = await this.prisma.syncHealth.findUnique({
      where: { channelId },
    });

    if (!syncHealth) {
      throw new NotFoundException(`Sync health for channel ID ${channelId} not found`);
    }

    return this.mapSyncHealth(syncHealth);
  }

  async update(id: number, updateSyncHealthDto: UpdateSyncHealthDto) {
    const syncHealth = await this.findOne(id);

    const updateData: any = { ...updateSyncHealthDto };

    // Handle date conversions
    if (updateSyncHealthDto.lastSync) {
      updateData.lastSync = new Date(updateSyncHealthDto.lastSync);
    }
    if (updateSyncHealthDto.nextSync) {
      updateData.nextSync = new Date(updateSyncHealthDto.nextSync);
    }

    // If channelId is being updated, check if new channel already has sync health
    if (updateSyncHealthDto.channelId && updateSyncHealthDto.channelId !== syncHealth.channelId) {
      const existing = await this.prisma.syncHealth.findUnique({
        where: { channelId: updateSyncHealthDto.channelId },
      });

      if (existing && existing.id !== id) {
        throw new BadRequestException('Sync health already exists for this channel');
      }
    }

    const updated = await this.prisma.syncHealth.update({
      where: { id },
      data: updateData,
    });

    return this.mapSyncHealth(updated);
  }

  async remove(id: number) {
    const syncHealth = await this.findOne(id);
    
    await this.prisma.syncHealth.delete({
      where: { id },
    });

    return this.mapSyncHealth(syncHealth);
  }

  /**
   * Upsert sync health - creates if doesn't exist, updates if it does
   */
  async upsertSyncHealth(channelId: number, channelName: string, syncFrequency?: string) {
    const existing = await this.prisma.syncHealth.findUnique({
      where: { channelId },
    });

    const nextSync = syncFrequency ? this.calculateNextSync(syncFrequency) : null;

    if (existing) {
      // Update existing
      const updated = await this.prisma.syncHealth.update({
        where: { channelId },
        data: {
          channelName,
          nextSync,
        },
      });
      return this.mapSyncHealth(updated);
    } else {
      // Create new
      const created = await this.prisma.syncHealth.create({
        data: {
          channelId,
          channelName,
          status: 'HEALTHY',
          recordsSynced: 0,
          recordsFailed: 0,
          nextSync,
        },
      });
      return this.mapSyncHealth(created);
    }
  }

  /**
   * Update sync health after a sync operation completes
   */
  async updateSyncHealthAfterSync(
    channelId: number,
    syncResult: {
      success: boolean;
      recordsSynced?: number;
      recordsFailed?: number;
      syncDuration?: number;
      errorMessage?: string;
    },
  ) {
    const syncHealth = await this.prisma.syncHealth.findUnique({
      where: { channelId },
    });

    if (!syncHealth) {
      throw new NotFoundException(`Sync health for channel ID ${channelId} not found`);
    }

    // Determine status based on sync result
    let status: SyncStatus = 'HEALTHY';
    if (!syncResult.success) {
      status = 'ERROR';
    } else if (syncResult.recordsFailed && syncResult.recordsFailed > 0) {
      // If some records failed but sync completed, set to WARNING
      status = syncResult.recordsFailed > syncResult.recordsSynced! * 0.1 ? 'ERROR' : 'WARNING';
    }

    // Calculate next sync time from channel's sync frequency
    // We'll get this from the integration's notes/config
    const integration = await this.prisma.integration.findUnique({
      where: { id: channelId },
    });

    let nextSync: Date | null = null;
    if (integration?.notes) {
      const syncFreqMatch = integration.notes.match(/Sync Frequency: (.+)/i);
      if (syncFreqMatch) {
        nextSync = this.calculateNextSync(syncFreqMatch[1]);
      }
    }

    const updated = await this.prisma.syncHealth.update({
      where: { channelId },
      data: {
        status,
        lastSync: new Date(),
        nextSync,
        recordsSynced: (syncHealth.recordsSynced || 0) + (syncResult.recordsSynced || 0),
        recordsFailed: (syncHealth.recordsFailed || 0) + (syncResult.recordsFailed || 0),
        syncDuration: syncResult.syncDuration,
        errorMessage: syncResult.errorMessage || null,
      },
    });

    return this.mapSyncHealth(updated);
  }

  /**
   * Set sync status to SYNCING when sync starts
   */
  async setSyncingStatus(channelId: number) {
    const syncHealth = await this.prisma.syncHealth.findUnique({
      where: { channelId },
    });

    if (!syncHealth) {
      return null;
    }

    const updated = await this.prisma.syncHealth.update({
      where: { channelId },
      data: {
        status: 'SYNCING',
      },
    });

    return this.mapSyncHealth(updated);
  }

  /**
   * Calculate next sync time from frequency string
   * Examples: "Every 15 minutes", "Every 1 hour", "Every 24 hours"
   */
  private calculateNextSync(syncFrequency: string): Date {
    const now = new Date();
    const frequency = syncFrequency.toLowerCase().trim();

    // Parse frequency string
    const minutesMatch = frequency.match(/(\d+)\s*minute/i);
    const hoursMatch = frequency.match(/(\d+)\s*hour/i);
    const daysMatch = frequency.match(/(\d+)\s*day/i);

    let minutesToAdd = 60; // Default to 1 hour

    if (minutesMatch) {
      minutesToAdd = parseInt(minutesMatch[1], 10);
    } else if (hoursMatch) {
      minutesToAdd = parseInt(hoursMatch[1], 10) * 60;
    } else if (daysMatch) {
      minutesToAdd = parseInt(daysMatch[1], 10) * 24 * 60;
    }

    const nextSync = new Date(now.getTime() + minutesToAdd * 60 * 1000);
    return nextSync;
  }

  /**
   * Remove sync health when channel is deleted
   */
  async removeByChannelId(channelId: number) {
    try {
      await this.prisma.syncHealth.delete({
        where: { channelId },
      });
      return { success: true };
    } catch (error) {
      // If sync health doesn't exist, that's okay
      return { success: true };
    }
  }

  private mapSyncHealth(syncHealth: any) {
    return {
      id: syncHealth.id,
      channelId: syncHealth.channelId,
      channelName: syncHealth.channelName,
      status: syncHealth.status?.toLowerCase() || 'healthy',
      lastSync: syncHealth.lastSync?.toISOString(),
      nextSync: syncHealth.nextSync?.toISOString(),
      recordsSynced: syncHealth.recordsSynced,
      recordsFailed: syncHealth.recordsFailed,
      syncDuration: syncHealth.syncDuration,
      errorMessage: syncHealth.errorMessage,
      createdAt: syncHealth.createdAt?.toISOString(),
    };
  }
}

