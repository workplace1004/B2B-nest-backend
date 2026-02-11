import { IsString, IsDateString, IsEnum, IsOptional, IsInt } from 'class-validator';

export enum CampaignEventType {
  DROP = 'DROP',
  LAUNCH = 'LAUNCH',
  PROMO = 'PROMO',
}

export class CreateCampaignEventDto {
  @IsString()
  name: string;

  @IsDateString()
  date: string;

  @IsEnum(CampaignEventType)
  type: CampaignEventType;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsInt()
  collectionId?: number;
}

