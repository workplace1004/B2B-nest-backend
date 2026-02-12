export class UpdateCreditNoteDto {
  invoiceId?: number;
  returnId?: number;
  amount?: number;
  currency?: string;
  reason?: string;
  status?: 'DRAFT' | 'ISSUED' | 'APPLIED' | 'CANCELLED';
  issuedDate?: string;
  appliedDate?: string;
  notes?: string;
}




