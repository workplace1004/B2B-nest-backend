import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DataExportsService {
  constructor(private prisma: PrismaService) {}

  async create(createExportDto: { name: string; format: string; type: string }, createdBy?: string) {
    // Map format and type to enum
    const exportFormat = this.mapFormatToEnum(createExportDto.format || 'csv');
    const exportType = this.mapTypeToEnum(createExportDto.type || 'custom');
    
    // Create data export record in database
    const exportRecord = await this.prisma.dataExport.create({
      data: {
        name: createExportDto.name,
        format: exportFormat,
        type: exportType,
        status: 'PENDING',
        recordsCount: 0,
        createdBy: createdBy || 'System',
      },
    });
    
    // Start background processing simulation
    this.processExport(exportRecord.id);
    
    // Return in the format expected by frontend
    return {
      data: {
        id: exportRecord.id,
        name: exportRecord.name,
        format: exportRecord.format.toLowerCase(),
        type: exportRecord.type.toLowerCase(),
        status: exportRecord.status.toLowerCase(),
        recordsCount: exportRecord.recordsCount,
        fileSize: exportRecord.fileSize,
        createdBy: exportRecord.createdBy,
        createdAt: exportRecord.createdAt.toISOString(),
        completedAt: exportRecord.completedAt?.toISOString(),
        errorMessage: exportRecord.errorMessage,
        fileUrl: exportRecord.fileUrl,
      },
    };
  }

  private async processExport(exportId: number) {
    // Simulate processing delay
    setTimeout(async () => {
      try {
        // Get export record
        const exportRecord = await this.prisma.dataExport.findUnique({
          where: { id: exportId },
        });

        if (!exportRecord) {
          return;
        }

        // Update status to PROCESSING
        await this.prisma.dataExport.update({
          where: { id: exportId },
          data: { status: 'PROCESSING' },
        });

        // Simulate processing time (2 seconds)
        setTimeout(async () => {
          try {
            // Generate actual CSV file
            const csvContent = await this.generateCSV(exportRecord.type);
            const fileExtension = exportRecord.format === 'EXCEL' ? 'xlsx' : 'csv';
            const fileName = `export-${exportId}.${fileExtension}`;
            
            // Create exports directory if it doesn't exist
            const exportsDir = path.join(process.cwd(), 'exports');
            if (!fs.existsSync(exportsDir)) {
              fs.mkdirSync(exportsDir, { recursive: true });
            }

            // Write file to disk
            const filePath = path.join(exportsDir, fileName);
            fs.writeFileSync(filePath, csvContent, 'utf-8');
            
            // Get file size
            const fileSize = fs.statSync(filePath).size;
            
            // Count records (lines minus header)
            const recordsCount = csvContent.split('\n').length - 1;
            
            // Update status to COMPLETED
            await this.prisma.dataExport.update({
              where: { id: exportId },
              data: {
                status: 'COMPLETED',
                recordsCount: recordsCount,
                fileSize: fileSize,
                fileUrl: `/data-exports/${exportId}/download`,
                filePath: filePath,
                completedAt: new Date(),
              },
            });
          } catch (error) {
            console.error(`Error completing export ${exportId}:`, error);
            // Update status to FAILED on error
            await this.prisma.dataExport.update({
              where: { id: exportId },
              data: {
                status: 'FAILED',
                errorMessage: error instanceof Error ? error.message : 'Unknown error occurred',
              },
            });
          }
        }, 2000); // 2 seconds processing time
      } catch (error) {
        console.error(`Error processing export ${exportId}:`, error);
      }
    }, 1000); // 1 second delay before starting processing
  }

  private async generateCSV(exportType: string): Promise<string> {
    let headers: string[] = [];
    let rows: any[] = [];

    switch (exportType) {
      case 'PRODUCTS':
        // Fetch all products
        const products = await this.prisma.product.findMany({
          include: {
            collection: true,
          },
          orderBy: { createdAt: 'desc' },
        });

        headers = [
          'ID',
          'Name',
          'SKU',
          'Style',
          'Sizes',
          'Colors',
          'Materials',
          'EAN',
          'Description',
          'Base Price',
          'Price',
          'Collection',
          'Created At',
          'Updated At',
        ];

        rows = products.map((product) => [
          product.id,
          product.name,
          product.sku,
          product.style || '',
          product.sizes.join('; '),
          product.colors.join('; '),
          product.materials.join('; '),
          product.ean || '',
          product.description || '',
          product.basePrice.toString(),
          product.price?.toString() || '',
          product.collection?.name || '',
          product.createdAt.toISOString(),
          product.updatedAt.toISOString(),
        ]);
        break;

      case 'ORDERS':
        const orders = await this.prisma.order.findMany({
          include: {
            customer: true,
          },
          orderBy: { createdAt: 'desc' },
        });

        headers = [
          'ID',
          'Order Number',
          'Customer',
          'Status',
          'Type',
          'Total Amount',
          'Currency',
          'Order Date',
          'Required Date',
          'Created At',
        ];

        rows = orders.map((order) => [
          order.id,
          order.orderNumber,
          order.customer?.name || '',
          order.status,
          order.type,
          order.totalAmount.toString(),
          order.currency,
          order.orderDate.toISOString(),
          order.requiredDate?.toISOString() || '',
          order.createdAt.toISOString(),
        ]);
        break;

      case 'CUSTOMERS':
        const customers = await this.prisma.customer.findMany({
          orderBy: { createdAt: 'desc' },
        });

        headers = [
          'ID',
          'Name',
          'Email',
          'Phone',
          'Type',
          'Company Name',
          'Contact Person',
          'Address',
          'City',
          'Country',
          'Postal Code',
          'Credit Limit',
          'Created At',
          'Updated At',
        ];

        rows = customers.map((customer) => [
          customer.id,
          customer.name,
          customer.email || '',
          customer.phone || '',
          customer.type,
          customer.companyName || '',
          customer.contactPerson || '',
          customer.address || '',
          customer.city || '',
          customer.country || '',
          customer.postalCode || '',
          customer.creditLimit?.toString() || '',
          customer.createdAt.toISOString(),
          customer.updatedAt.toISOString(),
        ]);
        break;

      case 'INVENTORY':
        const inventory = await this.prisma.inventory.findMany({
          include: {
            product: true,
            warehouse: true,
          },
          orderBy: { createdAt: 'desc' },
        });

        headers = [
          'ID',
          'Product Name',
          'SKU',
          'Warehouse',
          'Quantity',
          'Reserved Quantity',
          'Available Quantity',
          'Reorder Point',
          'Safety Stock',
          'Last Updated',
          'Created At',
          'Updated At',
        ];

        rows = inventory.map((item) => [
          item.id,
          item.product?.name || '',
          item.product?.sku || '',
          item.warehouse?.name || '',
          item.quantity.toString(),
          item.reservedQty.toString(),
          item.availableQty.toString(),
          item.reorderPoint.toString(),
          item.safetyStock.toString(),
          item.lastUpdated.toISOString(),
          item.createdAt.toISOString(),
          item.updatedAt.toISOString(),
        ]);
        break;

      default:
        headers = ['ID', 'Name', 'Created At'];
        rows = [[1, 'Sample', new Date().toISOString()]];
    }

    // Generate CSV content
    const csvRows = [
      headers.join(','),
      ...rows.map((row) =>
        row
          .map((cell: any) => {
            // Escape commas and quotes in cell values
            const cellStr = String(cell || '');
            if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
              return `"${cellStr.replace(/"/g, '""')}"`;
            }
            return cellStr;
          })
          .join(','),
      ),
    ];

    return csvRows.join('\n');
  }

  private async getExportFormat(exportId: number): Promise<string> {
    const exportRecord = await this.prisma.dataExport.findUnique({
      where: { id: exportId },
      select: { format: true },
    });
    return exportRecord?.format === 'EXCEL' ? 'xlsx' : 'csv';
  }

  async findAll(skip?: number, take?: number) {
    const [data, total] = await Promise.all([
      this.prisma.dataExport.findMany({
        skip: skip || 0,
        take: take || 1000,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.dataExport.count(),
    ]);

    // Transform to match frontend expectations
    const transformedData = data.map((item) => ({
      id: item.id,
      name: item.name,
      format: item.format.toLowerCase(),
      type: item.type.toLowerCase(),
      status: item.status.toLowerCase(),
      recordsCount: item.recordsCount,
      fileSize: item.fileSize,
      createdBy: item.createdBy,
      createdAt: item.createdAt.toISOString(),
      completedAt: item.completedAt?.toISOString(),
      errorMessage: item.errorMessage,
      fileUrl: item.fileUrl,
    }));

    return {
      data: transformedData,
      total,
      skip: skip || 0,
      take: take || 1000,
    };
  }

  async findOne(id: number) {
    const exportRecord = await this.prisma.dataExport.findUnique({
      where: { id },
    });

    if (!exportRecord) {
      throw new NotFoundException(`Data export with ID ${id} not found`);
    }

    return {
      data: {
        id: exportRecord.id,
        name: exportRecord.name,
        format: exportRecord.format.toLowerCase(),
        type: exportRecord.type.toLowerCase(),
        status: exportRecord.status.toLowerCase(),
        recordsCount: exportRecord.recordsCount,
        fileSize: exportRecord.fileSize,
        createdBy: exportRecord.createdBy,
        createdAt: exportRecord.createdAt.toISOString(),
        completedAt: exportRecord.completedAt?.toISOString(),
        errorMessage: exportRecord.errorMessage,
        fileUrl: exportRecord.fileUrl,
        filePath: exportRecord.filePath,
      },
    };
  }

  async update(id: number, updates: any) {
    // Map status and format if provided
    const updateData: any = {};
    if (updates.status) {
      updateData.status = updates.status.toUpperCase();
    }
    if (updates.format) {
      updateData.format = this.mapFormatToEnum(updates.format);
    }
    if (updates.type) {
      updateData.type = this.mapTypeToEnum(updates.type);
    }
    if (updates.name) {
      updateData.name = updates.name;
    }
    if (updates.recordsCount !== undefined) {
      updateData.recordsCount = updates.recordsCount;
    }
    if (updates.fileSize !== undefined) {
      updateData.fileSize = updates.fileSize;
    }
    if (updates.fileUrl !== undefined) {
      updateData.fileUrl = updates.fileUrl;
    }
    if (updates.completedAt !== undefined) {
      updateData.completedAt = updates.completedAt;
    }
    if (updates.errorMessage !== undefined) {
      updateData.errorMessage = updates.errorMessage;
    }

    const updated = await this.prisma.dataExport.update({
      where: { id },
      data: updateData,
    });

    return {
      data: {
        id: updated.id,
        name: updated.name,
        format: updated.format.toLowerCase(),
        type: updated.type.toLowerCase(),
        status: updated.status.toLowerCase(),
        recordsCount: updated.recordsCount,
        fileSize: updated.fileSize,
        createdBy: updated.createdBy,
        createdAt: updated.createdAt.toISOString(),
        completedAt: updated.completedAt?.toISOString(),
        errorMessage: updated.errorMessage,
        fileUrl: updated.fileUrl,
      },
    };
  }

  async remove(id: number) {
    await this.prisma.dataExport.delete({
      where: { id },
    });
    return { id, deleted: true };
  }

  private mapFormatToEnum(format: string): 'CSV' | 'EXCEL' {
    const formatMap: Record<string, 'CSV' | 'EXCEL'> = {
      csv: 'CSV',
      excel: 'EXCEL',
    };
    return formatMap[format.toLowerCase()] || 'CSV';
  }

  private mapTypeToEnum(type: string): 'PRODUCTS' | 'ORDERS' | 'CUSTOMERS' | 'INVENTORY' | 'CUSTOM' {
    const typeMap: Record<string, 'PRODUCTS' | 'ORDERS' | 'CUSTOMERS' | 'INVENTORY' | 'CUSTOM'> = {
      products: 'PRODUCTS',
      orders: 'ORDERS',
      customers: 'CUSTOMERS',
      inventory: 'INVENTORY',
      custom: 'CUSTOM',
    };
    return typeMap[type.toLowerCase()] || 'CUSTOM';
  }
}

