import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSyncHealthDto } from './dto/create-sync-health.dto';
import { UpdateSyncHealthDto } from './dto/update-sync-health.dto';

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

