import { Module } from '@nestjs/common';
import { BackordersService } from './backorders.service';
import { BackordersController } from './backorders.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BackordersController],
  providers: [BackordersService],
  exports: [BackordersService],
})
export class BackordersModule {}

