import { Injectable } from '@nestjs/common';

@Injectable()
export class AccountingFieldsService {
  findAll() {
    // Return a list of standard accounting fields
    return {
      data: [
        { id: 'customer_id', label: 'Customer ID', type: 'string' },
        { id: 'customer_name', label: 'Customer Name', type: 'string' },
        { id: 'order_number', label: 'Order Number', type: 'string' },
        { id: 'order_date', label: 'Order Date', type: 'date' },
        { id: 'total_amount', label: 'Total Amount', type: 'number' },
        { id: 'currency', label: 'Currency', type: 'string' },
        { id: 'invoice_number', label: 'Invoice Number', type: 'string' },
        { id: 'invoice_date', label: 'Invoice Date', type: 'date' },
        { id: 'due_date', label: 'Due Date', type: 'date' },
        { id: 'payment_status', label: 'Payment Status', type: 'string' },
        { id: 'product_sku', label: 'Product SKU', type: 'string' },
        { id: 'product_name', label: 'Product Name', type: 'string' },
        { id: 'quantity', label: 'Quantity', type: 'number' },
        { id: 'unit_price', label: 'Unit Price', type: 'number' },
        { id: 'tax_rate', label: 'Tax Rate', type: 'number' },
        { id: 'tax_amount', label: 'Tax Amount', type: 'number' },
        { id: 'discount', label: 'Discount', type: 'number' },
        { id: 'subtotal', label: 'Subtotal', type: 'number' },
        { id: 'shipping_address', label: 'Shipping Address', type: 'string' },
        { id: 'billing_address', label: 'Billing Address', type: 'string' },
      ],
    };
  }
}

