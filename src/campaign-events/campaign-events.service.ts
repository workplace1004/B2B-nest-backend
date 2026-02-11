import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCampaignEventDto } from './dto/create-campaign-event.dto';
import { UpdateCampaignEventDto } from './dto/update-campaign-event.dto';

@Injectable()
export class CampaignEventsService {
  constructor(private prisma: PrismaService) {}

  async create(createCampaignEventDto: CreateCampaignEventDto) {
    try {
      const campaignEvent = await this.prisma.campaignEvent.create({
        data: {
          ...createCampaignEventDto,
          date: new Date(createCampaignEventDto.date),
        },
        include: {
          collection: true,
        },
      });
      return campaignEvent;
    } catch (error) {
      console.error('Error in CampaignEventsService.create:', error);
      throw error;
    }
  }

  async findAll(skip?: number, take?: number) {
    try {
      const campaignEvents = await this.prisma.campaignEvent.findMany({
        skip,
        take,
        include: {
          collection: true,
        },
        orderBy: {
          date: 'asc',
        },
      });
      return campaignEvents;
    } catch (error) {
      console.error('Error in CampaignEventsService.findAll:', error);
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const campaignEvent = await this.prisma.campaignEvent.findUnique({
        where: { id },
        include: {
          collection: true,
        },
      });

      if (!campaignEvent) {
        throw new NotFoundException(`Campaign event with ID ${id} not found`);
      }

      return campaignEvent;
    } catch (error) {
      console.error('Error in CampaignEventsService.findOne:', error);
      throw error;
    }
  }

  async update(id: number, updateCampaignEventDto: UpdateCampaignEventDto) {
    try {
      await this.findOne(id);

      const data: any = { ...updateCampaignEventDto };
      if (updateCampaignEventDto.date) {
        data.date = new Date(updateCampaignEventDto.date);
      }

      const campaignEvent = await this.prisma.campaignEvent.update({
        where: { id },
        data,
        include: {
          collection: true,
        },
      });

      return campaignEvent;
    } catch (error) {
      console.error('Error in CampaignEventsService.update:', error);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      await this.findOne(id);
      await this.prisma.campaignEvent.delete({
        where: { id },
      });
      return { message: 'Campaign event deleted successfully' };
    } catch (error) {
      console.error('Error in CampaignEventsService.remove:', error);
      throw error;
    }
  }
}

