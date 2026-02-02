import { PartialType } from '@nestjs/mapped-types';
import { CreateSizeChartDto } from './create-size-chart.dto';

export class UpdateSizeChartDto extends PartialType(CreateSizeChartDto) {}

