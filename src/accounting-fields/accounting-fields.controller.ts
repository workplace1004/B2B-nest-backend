import { Controller, Get, UseGuards } from '@nestjs/common';
import { AccountingFieldsService } from './accounting-fields.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('accounting-fields')
@UseGuards(JwtAuthGuard)
export class AccountingFieldsController {
  constructor(private readonly accountingFieldsService: AccountingFieldsService) {}

  @Get()
  findAll() {
    return this.accountingFieldsService.findAll();
  }
}

