import { IsNotEmpty } from 'class-validator';

export class UpdateB2BTermsConfigurationDto {
  @IsNotEmpty()
  data: any; // JSON array of B2B terms
}

