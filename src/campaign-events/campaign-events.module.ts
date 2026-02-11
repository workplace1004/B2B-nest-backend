import { Module } from '@nestjs/common';
import { CampaignEventsService } from './campaign-events.service';
import { CampaignEventsController } from './campaign-events.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CampaignEventsController],
  providers: [CampaignEventsService],
})
export class CampaignEventsModule {}

