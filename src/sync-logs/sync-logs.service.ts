import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SyncLogsService {
  constructor(private prisma: PrismaService) {}

  async findAll(status?: string) {
    const where: any = {};
    
    if (status && status !== 'all') {
      where.status = this.mapStatusToPrisma(status);
    }

    const logs = await this.prisma.syncLog.findMany({
      where,
      orderBy: { startedAt: 'desc' },
    });

    return {
      data: logs.map((log) => this.mapSyncLog(log)),
    };
  }

  async findOne(id: number) {
    const log = await this.prisma.syncLog.findUnique({
      where: { id },
    });

    if (!log) {
      throw new Error(`Sync log with ID ${id} not found`);
    }

    return { data: this.mapSyncLog(log) };
  }

  async startSync(mappingId?: number) {
    // Create sync log in database
    const syncLog = await this.prisma.syncLog.create({
      data: {
        syncType: mappingId ? 'MAPPING' : 'FULL',
        status: 'IN_PROGRESS',
        mappingId: mappingId || null,
        recordsProcessed: 0,
        recordsFailed: 0,
      },
    });

    // Start async sync process (don't await - let it run in background)
    this.processSync(syncLog.id, mappingId).catch((error) => {
      console.error('Sync process error:', error);
    });

    return { data: this.mapSyncLog(syncLog) };
  }

  private async processSync(syncLogId: number, mappingId?: number) {
    let recordsProcessed = 0;
    let recordsFailed = 0;
    const errors: string[] = [];

    try {
      // Fetch active mappings
      const whereClause: any = { status: 'ACTIVE' };
      if (mappingId) {
        whereClause.id = mappingId;
      }

      const mappings = await this.prisma.vismaMapping.findMany({
        where: whereClause,
      });

      if (mappings.length === 0) {
        // Check if there are any mappings at all
        const allMappings = await this.prisma.vismaMapping.findMany({
          select: { id: true, status: true, name: true },
        });
        
        let errorMessage = 'No active mappings found. ';
        if (allMappings.length === 0) {
          errorMessage += 'Please create a mapping first.';
        } else {
          const pendingCount = allMappings.filter(m => m.status === 'PENDING').length;
          const inactiveCount = allMappings.filter(m => m.status === 'INACTIVE').length;
          errorMessage += `Found ${allMappings.length} mapping(s) but none are active. `;
          if (pendingCount > 0) {
            errorMessage += `${pendingCount} pending, `;
          }
          if (inactiveCount > 0) {
            errorMessage += `${inactiveCount} inactive. `;
          }
          errorMessage += 'Please activate at least one mapping to sync.';
        }
        
        await this.updateSyncLog(syncLogId, {
          status: 'FAILED',
          recordsProcessed: 0,
          recordsFailed: 0,
          errorMessage,
          completedAt: new Date(),
        });
        return;
      }

      // Update progress: starting
      await this.updateSyncLog(syncLogId, {
        recordsProcessed: 0,
        recordsFailed: 0,
      });

      // Process each mapping
      for (const mapping of mappings) {
        try {
          const result = await this.processMapping(mapping);
          recordsProcessed += result.processed;
          recordsFailed += result.failed;
          if (result.errors.length > 0) {
            errors.push(...result.errors);
          }

          // Update progress after each mapping
          await this.updateSyncLog(syncLogId, {
            recordsProcessed,
            recordsFailed,
          });
        } catch (error) {
          recordsFailed++;
          const errorMsg = `Mapping "${mapping.name}" failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
          errors.push(errorMsg);
          
          // Update progress even on mapping failure
          await this.updateSyncLog(syncLogId, {
            recordsProcessed,
            recordsFailed,
          });
        }
      }

      // Update sync log with final status
      await this.updateSyncLog(syncLogId, {
        status: recordsFailed === 0 ? 'SUCCESS' : recordsFailed < recordsProcessed ? 'SUCCESS' : 'FAILED',
        recordsProcessed,
        recordsFailed,
        errorMessage: errors.length > 0 ? errors.slice(0, 5).join('; ') : null,
        completedAt: new Date(),
      });
    } catch (error) {
      await this.updateSyncLog(syncLogId, {
        status: 'FAILED',
        recordsProcessed,
        recordsFailed,
        errorMessage: error instanceof Error ? error.message : 'Unknown error during sync',
        completedAt: new Date(),
      });
    }
  }

  private async processMapping(mapping: any): Promise<{ processed: number; failed: number; errors: string[] }> {
    let processed = 0;
    let failed = 0;
    const errors: string[] = [];

    // Determine data source based on source field
    const sourceField = mapping.sourceField;
    let dataRecords: any[] = [];

    try {
      // Fetch data based on source field type
      if (sourceField.includes('customer')) {
        dataRecords = await this.fetchCustomerData(sourceField);
      } else if (sourceField.includes('invoice')) {
        dataRecords = await this.fetchInvoiceData(sourceField);
      } else if (sourceField.includes('order')) {
        dataRecords = await this.fetchOrderData(sourceField);
      } else {
        throw new Error(`Unknown source field type: ${sourceField}`);
      }

      // Process each record
      for (const record of dataRecords) {
        try {
          // Extract source value
          const sourceValue = this.extractFieldValue(record, sourceField);

          // Apply transformation
          const transformedValue = this.applyTransformation(
            sourceValue,
            mapping.transformation,
          );

          // Map to target field (simulate Visma API call)
          await this.syncToVisma(mapping.targetField, transformedValue, mapping.syncDirection);

          processed++;
        } catch (error) {
          failed++;
          errors.push(
            `Record ID ${record.id}: ${error instanceof Error ? error.message : 'Unknown error'}`,
          );
        }
      }
    } catch (error) {
      throw new Error(`Failed to process mapping "${mapping.name}": ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return { processed, failed, errors };
  }

  private async fetchCustomerData(sourceField: string): Promise<any[]> {
    const customers = await this.prisma.customer.findMany({
      where: { isActive: true },
      take: 1000, // Limit for performance
    });

    return customers.map((customer) => ({
      id: customer.id,
      customer_id: customer.id.toString(),
      customer_name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      city: customer.city,
      country: customer.country,
      postalCode: customer.postalCode,
      companyName: customer.companyName,
      taxId: customer.taxId,
      ...customer,
    }));
  }

  private async fetchInvoiceData(sourceField: string): Promise<any[]> {
    const invoices = await this.prisma.proformaInvoice.findMany({
      where: {
        status: { in: ['SENT', 'PAID'] },
      },
      include: {
        customer: true,
      },
      take: 1000,
    });

    return invoices.map((invoice) => ({
      id: invoice.id,
      invoice_number: invoice.invoiceNumber,
      invoice_date: invoice.createdAt,
      due_date: invoice.dueDate,
      customer_id: invoice.customerId.toString(),
      customer_name: invoice.customer?.name || '',
      total_amount: Number(invoice.totalAmount),
      subtotal: Number(invoice.subtotal),
      tax_rate: Number(invoice.taxRate),
      tax_amount: Number(invoice.taxAmount),
      currency: invoice.currency,
      payment_status: invoice.status === 'PAID' ? 'paid' : 'pending',
      ...invoice,
    }));
  }

  private async fetchOrderData(sourceField: string): Promise<any[]> {
    const orders = await this.prisma.order.findMany({
      where: {
        status: { not: 'CANCELLED' },
      },
      include: {
        customer: true,
      },
      take: 1000,
    });

    return orders.map((order) => ({
      id: order.id,
      order_number: order.orderNumber,
      order_date: order.orderDate,
      customer_id: order.customerId.toString(),
      customer_name: order.customer?.name || '',
      total_amount: Number(order.totalAmount),
      currency: order.currency,
      status: order.status.toLowerCase(),
      ...order,
    }));
  }

  private extractFieldValue(record: any, sourceField: string): any {
    // Handle nested field access
    const fieldMap: { [key: string]: string } = {
      customer_id: 'customer_id',
      customer_name: 'customer_name',
      order_number: 'order_number',
      order_date: 'order_date',
      total_amount: 'total_amount',
      currency: 'currency',
      invoice_number: 'invoice_number',
      invoice_date: 'invoice_date',
      due_date: 'due_date',
      payment_status: 'payment_status',
      product_sku: 'product_sku',
      product_name: 'product_name',
      quantity: 'quantity',
      unit_price: 'unit_price',
      tax_rate: 'tax_rate',
      tax_amount: 'tax_amount',
      discount: 'discount',
      subtotal: 'subtotal',
      shipping_address: 'shipping_address',
      billing_address: 'billing_address',
    };

    const mappedField = fieldMap[sourceField] || sourceField;
    return record[mappedField] ?? record[sourceField] ?? null;
  }

  private applyTransformation(value: any, transformation: string): any {
    if (value === null || value === undefined) {
      return value;
    }

    const stringValue = String(value);

    switch (transformation) {
      case 'UPPERCASE':
        return stringValue.toUpperCase();
      case 'LOWERCASE':
        return stringValue.toLowerCase();
      case 'TRIM':
        return stringValue.trim();
      case 'NONE':
      default:
        return value;
    }
  }

  private async syncToVisma(
    targetField: string,
    value: any,
    syncDirection: string,
  ): Promise<void> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 10));

    // In a real implementation, this would:
    // 1. Build Visma API request payload
    // 2. Call Visma/eAccounting API
    // 3. Handle response and errors
    // 4. Update local records if bidirectional

    // For now, simulate potential errors (5% failure rate for demonstration)
    if (Math.random() < 0.05) {
      throw new Error(`Visma API error: Failed to sync ${targetField}`);
    }

    // Log successful sync (in production, this would be actual API call)
    console.log(`Synced ${targetField} = ${value} (${syncDirection})`);
  }

  private async updateSyncLog(
    syncLogId: number,
    updates: {
      status?: 'SUCCESS' | 'FAILED' | 'IN_PROGRESS' | 'PENDING';
      recordsProcessed?: number;
      recordsFailed?: number;
      errorMessage?: string | null;
      completedAt?: Date;
    },
  ): Promise<void> {
    await this.prisma.syncLog.update({
      where: { id: syncLogId },
      data: updates,
    });
  }

  private mapSyncLog(log: any) {
    return {
      id: log.id,
      syncType: this.mapSyncTypeFromPrisma(log.syncType),
      status: this.mapStatusFromPrisma(log.status),
      mappingId: log.mappingId,
      recordsProcessed: log.recordsProcessed,
      recordsFailed: log.recordsFailed,
      startedAt: log.startedAt.toISOString(),
      completedAt: log.completedAt?.toISOString(),
      errorMessage: log.errorMessage,
    };
  }

  // Map Prisma enum to frontend format
  private mapStatusFromPrisma(status: string): 'success' | 'failed' | 'in-progress' | 'pending' {
    switch (status) {
      case 'SUCCESS':
        return 'success';
      case 'FAILED':
        return 'failed';
      case 'IN_PROGRESS':
        return 'in-progress';
      case 'PENDING':
        return 'pending';
      default:
        return 'pending';
    }
  }

  private mapStatusToPrisma(status: string): 'SUCCESS' | 'FAILED' | 'IN_PROGRESS' | 'PENDING' {
    switch (status) {
      case 'success':
        return 'SUCCESS';
      case 'failed':
        return 'FAILED';
      case 'in-progress':
        return 'IN_PROGRESS';
      case 'pending':
        return 'PENDING';
      default:
        return 'PENDING';
    }
  }

  private mapSyncTypeFromPrisma(syncType: string): string {
    switch (syncType) {
      case 'FULL':
        return 'full';
      case 'INCREMENTAL':
        return 'incremental';
      case 'MAPPING':
        return 'mapping';
      default:
        return 'full';
    }
  }
}

