import { Module } from '@nestjs/common';
import { NumberingRulesService } from './numbering-rules.service';
import { NumberingRulesController } from './numbering-rules.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [NumberingRulesController],
  providers: [NumberingRulesService],
  exports: [NumberingRulesService],
})
export class NumberingRulesModule {}

