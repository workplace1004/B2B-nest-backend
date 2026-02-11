import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskCategoryDto } from './create-task-category.dto';

export class UpdateTaskCategoryDto extends PartialType(CreateTaskCategoryDto) {}

