import { Controller, Get } from '@nestjs/common';
import { VismaFieldsService } from './visma-fields.service';
@Controller('visma-fields')
export class VismaFieldsController {
  constructor(private readonly vismaFieldsService: VismaFieldsService) {}

  @Get()
  findAll() {
    return this.vismaFieldsService.findAll();
  }
}

