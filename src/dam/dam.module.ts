import { Module } from '@nestjs/common';
import { DAMService } from './dam.service';
import { DAMController } from './dam.controller';

@Module({
  controllers: [DAMController],
  providers: [DAMService],
  exports: [DAMService],
})
export class DamModule {}

