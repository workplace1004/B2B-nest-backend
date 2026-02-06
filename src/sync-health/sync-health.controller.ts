import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { SyncHealthService } from './sync-health.service';
import { CreateSyncHealthDto } from './dto/create-sync-health.dto';
import { UpdateSyncHealthDto } from './dto/update-sync-health.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('sync-health')
@UseGuards(JwtAuthGuard)
export class SyncHealthController {
  constructor(private readonly syncHealthService: SyncHealthService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
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
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateSyncHealthDto: UpdateSyncHealthDto) {
    return this.syncHealthService.update(+id, updateSyncHealthDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.syncHealthService.remove(+id);
  }
}

