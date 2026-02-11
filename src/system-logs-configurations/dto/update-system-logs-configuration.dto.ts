import { IsNotEmpty } from 'class-validator';

export class UpdateSystemLogsConfigurationDto {
  @IsNotEmpty()
  data: any; // JSON array of system logs
}

