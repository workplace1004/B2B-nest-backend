import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { B2BTermsConfigurationsService } from './b2b-terms-configurations.service';
import { UpdateB2BTermsConfigurationDto } from './dto/update-b2b-terms-configuration.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('b2b-terms-configurations')
@UseGuards(JwtAuthGuard)
export class B2BTermsConfigurationsController {
  constructor(private readonly b2bTermsConfigurationsService: B2BTermsConfigurationsService) {}

  @Post()
  upsert(@Body() updateB2BTermsConfigurationDto: UpdateB2BTermsConfigurationDto) {
    return this.b2bTermsConfigurationsService.upsert(updateB2BTermsConfigurationDto.data);
  }

  @Get()
  findOne() {
    return this.b2bTermsConfigurationsService.findOne();
  }
}

