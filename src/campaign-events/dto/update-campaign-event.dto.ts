import { PartialType } from '@nestjs/mapped-types';
import { CreateCampaignEventDto } from './create-campaign-event.dto';

export class UpdateCampaignEventDto extends PartialType(CreateCampaignEventDto) {}

