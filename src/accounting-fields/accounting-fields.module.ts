import { Module } from '@nestjs/common';
import { AccountingFieldsService } from './accounting-fields.service';
import { AccountingFieldsController } from './accounting-fields.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AccountingFieldsController],
  providers: [AccountingFieldsService],
  exports: [AccountingFieldsService],
})
export class AccountingFieldsModule {}

