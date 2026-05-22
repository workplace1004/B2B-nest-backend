import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CampaignEventsService } from './campaign-events.service';
import { CreateCampaignEventDto } from './dto/create-campaign-event.dto';
import { UpdateCampaignEventDto } from './dto/update-campaign-event.dto';
@Controller('campaign-events')
export class CampaignEventsController {
  constructor(private readonly campaignEventsService: CampaignEventsService) {}

  @Post()
  create(@Body() createCampaignEventDto: CreateCampaignEventDto) {
    try {
      return this.campaignEventsService.create(createCampaignEventDto);
    } catch (error) {
      console.error('Error in CampaignEventsController.create:', error);
      throw error;
    }
  }

  @Get()
  findAll(@Query('skip') skip?: string, @Query('take') take?: string) {
    try {
      return this.campaignEventsService.findAll(skip ? +skip : undefined, take ? +take : undefined);
    } catch (error) {
      console.error('Error in CampaignEventsController.findAll:', error);
      throw error;
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    try {
      return this.campaignEventsService.findOne(+id);
    } catch (error) {
      console.error('Error in CampaignEventsController.findOne:', error);
      throw error;
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCampaignEventDto: UpdateCampaignEventDto) {
    try {
      return this.campaignEventsService.update(+id, updateCampaignEventDto);
    } catch (error) {
      console.error('Error in CampaignEventsController.update:', error);
      throw error;
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    try {
      return this.campaignEventsService.remove(+id);
    } catch (error) {
      console.error('Error in CampaignEventsController.remove:', error);
      throw error;
    }
  }
}

