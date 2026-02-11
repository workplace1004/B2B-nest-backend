import { Module } from '@nestjs/common';
import { PackSlipsService } from './pack-slips.service';
import { PackSlipsController } from './pack-slips.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PackSlipsController],
  providers: [PackSlipsService],
  exports: [PackSlipsService],
})
export class PackSlipsModule {}

