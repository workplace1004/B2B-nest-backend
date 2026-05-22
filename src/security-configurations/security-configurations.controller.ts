import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { SecurityConfigurationsService } from './security-configurations.service';
import { UpdateSecurityConfigurationDto } from './dto/update-security-configuration.dto';
import { SecurityConfigurationType } from '@prisma/client';

@Controller('security-configurations')
export class SecurityConfigurationsController {
  constructor(private readonly securityConfigurationsService: SecurityConfigurationsService) {}

  @Post()
  upsert(@Body() updateSecurityConfigurationDto: UpdateSecurityConfigurationDto) {
    return this.securityConfigurationsService.upsert(
      updateSecurityConfigurationDto.type,
      updateSecurityConfigurationDto.data,
    );
  }

  @Get()
  findAll() {
    return this.securityConfigurationsService.findAll();
  }

  @Get(':type')
  findOne(@Param('type') type: string) {
    return this.securityConfigurationsService.findOne(type as SecurityConfigurationType);
  }
}

