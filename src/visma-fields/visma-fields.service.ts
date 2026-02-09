import { Injectable } from '@nestjs/common';

@Injectable()
export class VismaFieldsService {
  findAll() {
    // Return a list of Visma/eAccounting fields
    return {
      data: [
        { id: 'customer_no', label: 'Customer Number', type: 'string' },
        { id: 'customer_name', label: 'Customer Name', type: 'string' },
        { id: 'order_no', label: 'Order Number', type: 'string' },
        { id: 'order_date', label: 'Order Date', type: 'date' },
        { id: 'amount', label: 'Amount', type: 'number' },
        { id: 'currency_code', label: 'Currency Code', type: 'string' },
        { id: 'invoice_no', label: 'Invoice Number', type: 'string' },
        { id: 'invoice_date', label: 'Invoice Date', type: 'date' },
        { id: 'due_date', label: 'Due Date', type: 'date' },
        { id: 'payment_status', label: 'Payment Status', type: 'string' },
        { id: 'item_code', label: 'Item Code', type: 'string' },
        { id: 'item_description', label: 'Item Description', type: 'string' },
        { id: 'qty', label: 'Quantity', type: 'number' },
        { id: 'unit_price', label: 'Unit Price', type: 'number' },
        { id: 'vat_rate', label: 'VAT Rate', type: 'number' },
        { id: 'vat_amount', label: 'VAT Amount', type: 'number' },
        { id: 'discount_percent', label: 'Discount Percent', type: 'number' },
        { id: 'net_amount', label: 'Net Amount', type: 'number' },
        { id: 'delivery_address', label: 'Delivery Address', type: 'string' },
        { id: 'invoice_address', label: 'Invoice Address', type: 'string' },
      ],
    };
  }
}

