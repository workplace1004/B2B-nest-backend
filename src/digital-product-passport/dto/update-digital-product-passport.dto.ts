import { PartialType } from '@nestjs/mapped-types';
import { CreateDigitalProductPassportDto } from './create-digital-product-passport.dto';

export class UpdateDigitalProductPassportDto extends PartialType(CreateDigitalProductPassportDto) {}








