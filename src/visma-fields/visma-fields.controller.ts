import { Controller, Get, UseGuards } from '@nestjs/common';
import { VismaFieldsService } from './visma-fields.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('visma-fields')
@UseGuards(JwtAuthGuard)
export class VismaFieldsController {
  constructor(private readonly vismaFieldsService: VismaFieldsService) {}

  @Get()
  findAll() {
    return this.vismaFieldsService.findAll();
  }
}

