import { Module } from '@nestjs/common';
import { ForecastService } from './forecast.service';
import { ForecastController } from './forecast.controller';

@Module({
  controllers: [ForecastController],
  providers: [ForecastService],
  exports: [ForecastService],
})
export class ForecastModule {}

