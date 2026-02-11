import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { SecurityConfigurationsService } from './security-configurations.service';
import { UpdateSecurityConfigurationDto } from './dto/update-security-configuration.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SecurityConfigurationType } from '@prisma/client';

@Controller('security-configurations')
@UseGuards(JwtAuthGuard)
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

