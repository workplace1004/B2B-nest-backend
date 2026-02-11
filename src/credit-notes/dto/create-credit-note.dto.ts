export class CreateCreditNoteDto {
  invoiceId?: number;
  returnId?: number;
  customerId: number;
  amount: number;
  currency?: string;
  reason?: string;
  status?: 'DRAFT' | 'ISSUED' | 'APPLIED' | 'CANCELLED';
  notes?: string;
}



