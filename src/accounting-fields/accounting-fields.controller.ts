import { Controller, Get } from '@nestjs/common';
import { AccountingFieldsService } from './accounting-fields.service';
@Controller('accounting-fields')
export class AccountingFieldsController {
  constructor(private readonly accountingFieldsService: AccountingFieldsService) {}

  @Get()
  findAll() {
    return this.accountingFieldsService.findAll();
  }
}

