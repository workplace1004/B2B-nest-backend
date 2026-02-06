import { Module } from '@nestjs/common';
import { SyncHealthService } from './sync-health.service';
import { SyncHealthController } from './sync-health.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SyncHealthController],
  providers: [SyncHealthService],
  exports: [SyncHealthService],
})
export class SyncHealthModule {}

