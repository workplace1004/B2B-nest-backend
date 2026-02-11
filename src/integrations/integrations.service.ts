import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIntegrationDto } from './dto/create-integration.dto';
import { UpdateIntegrationDto } from './dto/update-integration.dto';
import { SyncHealthService } from '../sync-health/sync-health.service';

@Injectable()
export class IntegrationsService {
  constructor(
    private prisma: PrismaService,
    private syncHealthService: SyncHealthService,
  ) {}

  async create(createIntegrationDto: CreateIntegrationDto) {
    const integration = await this.prisma.integration.create({
      data: createIntegrationDto,
    });

    // Auto-create sync health for the new channel
    try {
      // Extract sync frequency from notes if available
      const notes = (createIntegrationDto.notes as string) || '';
      const syncFreqMatch = notes.match(/Sync Frequency: (.+)/i);
      const syncFrequency = syncFreqMatch ? syncFreqMatch[1] : undefined;

      await this.syncHealthService.upsertSyncHealth(
        integration.id,
        integration.name,
        syncFrequency,
      );
    } catch (error) {
      // Log error but don't fail channel creation if sync health creation fails
      console.error('Failed to create sync health for channel:', error);
    }

    return integration;
  }

  async findAll(skip?: number, take?: number, type?: string) {
    const where: any = {};
    if (type) {
      where.type = type;
    }

    const integrations = await this.prisma.integration.findMany({
      skip,
      take,
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return integrations;
  }

  async findOne(id: number) {
    const integration = await this.prisma.integration.findUnique({
      where: { id },
    });

    if (!integration) {
      throw new NotFoundException(`Integration with ID ${id} not found`);
    }

    return integration;
  }

  async update(id: number, updateIntegrationDto: UpdateIntegrationDto) {
    const integration = await this.findOne(id);

    const updatedIntegration = await this.prisma.integration.update({
      where: { id },
      data: updateIntegrationDto,
    });

    // Update sync health if channel name or sync frequency changed
    try {
      const notes = (updateIntegrationDto.notes as string) || integration.notes || '';
      const syncFreqMatch = notes.match(/Sync Frequency: (.+)/i);
      const syncFrequency = syncFreqMatch ? syncFreqMatch[1] : undefined;

      await this.syncHealthService.upsertSyncHealth(
        id,
        updatedIntegration.name,
        syncFrequency,
      );
    } catch (error) {
      // Log error but don't fail channel update if sync health update fails
      console.error('Failed to update sync health for channel:', error);
    }

    return updatedIntegration;
  }

  async remove(id: number) {
    await this.findOne(id);
    
    // Delete sync health when channel is deleted
    try {
      await this.syncHealthService.removeByChannelId(id);
    } catch (error) {
      console.error('Failed to delete sync health for channel:', error);
    }

    await this.prisma.integration.delete({
      where: { id },
    });
    return { message: 'Integration deleted successfully' };
  }
}

