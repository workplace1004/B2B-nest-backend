import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { IntegrationsService } from './integrations.service';
import { CreateIntegrationDto } from './dto/create-integration.dto';
import { UpdateIntegrationDto } from './dto/update-integration.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ChannelSyncService, SyncResult } from '../channel-sync/channel-sync.service';

@Controller('integrations')
@UseGuards(JwtAuthGuard)
export class IntegrationsController {
  constructor(
    private readonly integrationsService: IntegrationsService,
    private readonly channelSyncService: ChannelSyncService,
  ) {}

  @Post()
  create(@Body() createIntegrationDto: CreateIntegrationDto) {
    return this.integrationsService.create(createIntegrationDto);
  }

  @Get()
  findAll(@Query('skip') skip?: string, @Query('take') take?: string, @Query('type') type?: string) {
    return this.integrationsService.findAll(skip ? +skip : undefined, take ? +take : undefined, type);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.integrationsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateIntegrationDto: UpdateIntegrationDto) {
    return this.integrationsService.update(+id, updateIntegrationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.integrationsService.remove(+id);
  }

  @Post(':id/sync')
  async syncChannel(@Param('id') id: string): Promise<{ success: boolean; message: string; data?: SyncResult; error?: string }> {
    try {
      const result = await this.channelSyncService.syncChannel(+id);
      return {
        success: true,
        message: 'Channel synced successfully',
        data: result,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to sync channel',
        error: error.message,
      };
    }
  }

  @Post('sync/all')
  async syncAllChannels(): Promise<{ success: boolean; message: string; data?: { channelId: number; result: SyncResult }[]; error?: string }> {
    try {
      const results = await this.channelSyncService.syncAllChannels();
      return {
        success: true,
        message: 'All channels synced',
        data: results,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to sync channels',
        error: error.message,
      };
    }
  }
}

