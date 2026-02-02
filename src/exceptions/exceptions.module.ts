import { Module } from '@nestjs/common';
import { ExceptionsService } from './exceptions.service';
import { ExceptionsController } from './exceptions.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ExceptionsController],
  providers: [ExceptionsService],
  exports: [ExceptionsService],
})
export class ExceptionsModule {}

