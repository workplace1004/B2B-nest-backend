import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SyncHealthService } from './sync-health.service';
import { CreateSyncHealthDto } from './dto/create-sync-health.dto';
import { UpdateSyncHealthDto } from './dto/update-sync-health.dto';
@Controller('sync-health')
export class SyncHealthController {
  constructor(private readonly syncHealthService: SyncHealthService) {}

  @Post()
      create(@Body() createSyncHealthDto: CreateSyncHealthDto) {
    return this.syncHealthService.create(createSyncHealthDto);
  }

  @Get()
  findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('status') status?: string,
  ) {
    return this.syncHealthService.findAll(skip ? +skip : undefined, take ? +take : undefined, status);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.syncHealthService.findOne(+id);
  }

  @Get('channel/:channelId')
  findByChannelId(@Param('channelId') channelId: string) {
    return this.syncHealthService.findByChannelId(+channelId);
  }

  @Patch(':id')
      update(@Param('id') id: string, @Body() updateSyncHealthDto: UpdateSyncHealthDto) {
    return this.syncHealthService.update(+id, updateSyncHealthDto);
  }

  @Delete(':id')
      remove(@Param('id') id: string) {
    return this.syncHealthService.remove(+id);
  }
}

