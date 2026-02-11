import { PartialType } from '@nestjs/mapped-types';
import { CreateSupplierNegotiationNoteDto } from './create-supplier-negotiation-note.dto';

export class UpdateSupplierNegotiationNoteDto extends PartialType(CreateSupplierNegotiationNoteDto) {}

