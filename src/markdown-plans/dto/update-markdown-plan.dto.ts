import { PartialType } from '@nestjs/mapped-types';
import { CreateMarkdownPlanDto } from './create-markdown-plan.dto';

export class UpdateMarkdownPlanDto extends PartialType(CreateMarkdownPlanDto) {}

