import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Express } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DataImportsService {
  constructor(private prisma: PrismaService) {}

  async create(file: Express.Multer.File, type?: string, uploadedBy?: string) {
    // Map type string to enum
    const importType = this.mapTypeToEnum(type || 'custom');
    
    // Create data import record in database
    const importRecord = await this.prisma.dataImport.create({
      data: {
        fileName: file?.originalname || 'import.csv',
        type: importType,
        status: 'PENDING',
        recordsTotal: 0,
        recordsProcessed: 0,
        recordsFailed: 0,
        uploadedBy: uploadedBy || 'System',
        fileUrl: file ? `/uploads/${file.filename}` : null,
        filePath: file?.path || null,
      },
    });
    
    // Start background processing simulation
    this.processImport(importRecord.id);
    
    // Return in the format expected by frontend
    return {
      data: {
        id: importRecord.id,
        fileName: importRecord.fileName,
        type: importRecord.type.toLowerCase(),
        status: importRecord.status.toLowerCase(),
        recordsTotal: importRecord.recordsTotal,
        recordsProcessed: importRecord.recordsProcessed,
        recordsFailed: importRecord.recordsFailed,
        uploadedBy: importRecord.uploadedBy,
        uploadedAt: importRecord.uploadedAt.toISOString(),
        completedAt: importRecord.completedAt?.toISOString(),
        errorMessage: importRecord.errorMessage,
        fileUrl: importRecord.fileUrl,
      },
    };
  }

  private async processImport(importId: number) {
    // Simulate processing delay
    setTimeout(async () => {
      try {
        // Get import record
        const importRecord = await this.prisma.dataImport.findUnique({
          where: { id: importId },
        });

        if (!importRecord || !importRecord.filePath) {
          await this.prisma.dataImport.update({
            where: { id: importId },
            data: {
              status: 'FAILED',
              errorMessage: 'File not found',
            },
          });
          return;
        }

        // Update status to PROCESSING
        await this.prisma.dataImport.update({
          where: { id: importId },
          data: { status: 'PROCESSING' },
        });

        // Read and parse CSV file
        const csvContent = fs.readFileSync(importRecord.filePath, 'utf-8');
        const lines = csvContent.split('\n').filter(line => line.trim().length > 0);
        
        if (lines.length < 2) {
          await this.prisma.dataImport.update({
            where: { id: importId },
            data: {
              status: 'FAILED',
              errorMessage: 'CSV file is empty or invalid',
            },
          });
          return;
        }

        // Parse header
        const headers = this.parseCSVLine(lines[0]);
        const totalRecords = lines.length - 1; // Exclude header

        // Update total records
        await this.prisma.dataImport.update({
          where: { id: importId },
          data: { recordsTotal: totalRecords },
        });

        // Process records
        let processedRecords = 0;
        let failedRecords = 0;
        const errors: string[] = [];

        for (let i = 1; i < lines.length; i++) {
          try {
            const row = this.parseCSVLine(lines[i]);
            if (row.length === 0) continue; // Skip empty rows

            await this.importRecord(importRecord.type, headers, row);
            processedRecords++;

            // Update progress every 10 records
            if (processedRecords % 10 === 0 || i === lines.length - 1) {
              await this.prisma.dataImport.update({
                where: { id: importId },
                data: {
                  recordsProcessed: processedRecords,
                  recordsFailed: failedRecords,
                },
              });
            }
          } catch (error) {
            failedRecords++;
            const errorMsg = error instanceof Error ? error.message : 'Unknown error';
            errors.push(`Row ${i + 1}: ${errorMsg}`);
            console.error(`Error importing row ${i + 1}:`, error);
          }
        }

        // Complete the import
        await this.prisma.dataImport.update({
          where: { id: importId },
          data: {
            status: 'COMPLETED',
            recordsProcessed: processedRecords,
            recordsFailed: failedRecords,
            errorMessage: errors.length > 0 ? errors.slice(0, 10).join('; ') : null, // Store first 10 errors
            completedAt: new Date(),
          },
        });
      } catch (error) {
        console.error(`Error processing import ${importId}:`, error);
        // Update status to FAILED on error
        await this.prisma.dataImport.update({
          where: { id: importId },
          data: {
            status: 'FAILED',
            errorMessage: error instanceof Error ? error.message : 'Unknown error occurred',
          },
        });
      }
    }, 1000); // 1 second delay before starting processing
  }

  private parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          current += '"';
          i++; // Skip next quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  }

  private async importRecord(type: string, headers: string[], row: string[]) {
    const data: any = {};
    headers.forEach((header, index) => {
      if (row[index] !== undefined) {
        data[header.toLowerCase().trim()] = row[index].trim();
      }
    });

    switch (type) {
      case 'PRODUCTS':
        await this.importProduct(data);
        break;
      case 'CUSTOMERS':
        await this.importCustomer(data);
        break;
      case 'ORDERS':
        await this.importOrder(data);
        break;
      case 'INVENTORY':
        await this.importInventory(data);
        break;
      default:
        throw new Error(`Unsupported import type: ${type}`);
    }
  }

  private async importProduct(data: any) {
    // Find or get default collection
    let collectionId = 1; // Default collection
    if (data.collection) {
      const collection = await this.prisma.collection.findFirst({
        where: { name: { contains: data.collection, mode: 'insensitive' } },
      });
      if (collection) {
        collectionId = collection.id;
      }
    }

    // Parse arrays
    const sizes = data.sizes ? data.sizes.split(';').map((s: string) => s.trim()).filter((s: string) => s) : [];
    const colors = data.colors ? data.colors.split(';').map((c: string) => c.trim()).filter((c: string) => c) : [];
    const materials = data.materials ? data.materials.split(';').map((m: string) => m.trim()).filter((m: string) => m) : [];

    // Check if product exists (by SKU)
    const existingProduct = await this.prisma.product.findUnique({
      where: { sku: data.sku || data.id?.toString() },
    });

    const productData = {
      name: data.name || data['product name'] || 'Imported Product',
      sku: data.sku || data.id?.toString() || `SKU-${Date.now()}`,
      style: data.style || null,
      sizes,
      colors,
      materials,
      ean: data.ean || null,
      description: data.description || null,
      basePrice: parseFloat(data['base price'] || data.baseprice || data.price || '0') || 0,
      price: parseFloat(data.price || data['base price'] || '0') || null,
      collectionId,
    };

    if (existingProduct) {
      // Update existing product
      await this.prisma.product.update({
        where: { id: existingProduct.id },
        data: productData,
      });
    } else {
      // Create new product
      await this.prisma.product.create({
        data: productData,
      });
    }
  }

  private async importCustomer(data: any) {
    const customerData = {
      name: data.name || data['customer name'] || 'Imported Customer',
      email: data.email || null,
      phone: data.phone || null,
      contactPerson: data['contact person'] || data.contactperson || null,
      type: (data.type || 'B2B').toUpperCase() as any,
      companyName: data['company name'] || data.companyname || null,
      taxId: data['tax id'] || data.taxid || null,
      address: data.address || null,
      city: data.city || null,
      country: data.country || null,
      postalCode: data['postal code'] || data.postalcode || null,
      creditLimit: data['credit limit'] || data.creditlimit ? parseFloat(data['credit limit'] || data.creditlimit) : null,
    };

    if (data.email) {
      const existingCustomer = await this.prisma.customer.findUnique({
        where: { email: data.email },
      });

      if (existingCustomer) {
        await this.prisma.customer.update({
          where: { id: existingCustomer.id },
          data: customerData,
        });
      } else {
        await this.prisma.customer.create({
          data: customerData,
        });
      }
    } else {
      await this.prisma.customer.create({
        data: customerData,
      });
    }
  }

  private async importOrder(data: any) {
    // Orders are more complex, so we'll create a basic order
    // In a real scenario, you'd need to handle order lines separately
    throw new Error('Order import requires additional implementation');
  }

  private async importInventory(data: any) {
    // Find product by SKU or name
    const product = await this.prisma.product.findFirst({
      where: {
        OR: [
          { sku: data.sku || '' },
          { name: { contains: data['product name'] || data.productname || '', mode: 'insensitive' } },
        ],
      },
    });

    if (!product) {
      throw new Error(`Product not found: ${data.sku || data['product name']}`);
    }

    // Find warehouse by name
    const warehouse = await this.prisma.warehouse.findFirst({
      where: {
        name: { contains: data.warehouse || '', mode: 'insensitive' },
      },
    });

    if (!warehouse) {
      throw new Error(`Warehouse not found: ${data.warehouse}`);
    }

    const quantity = parseInt(data.quantity || '0', 10) || 0;
    const reservedQty = parseInt(data['reserved quantity'] || data.reservedquantity || '0', 10) || 0;
    const availableQty = quantity - reservedQty;
    const reorderPoint = parseInt(data['reorder point'] || data.reorderpoint || '0', 10) || 0;
    const safetyStock = parseInt(data['safety stock'] || data.safetystock || '0', 10) || 0;

    // Check if inventory exists
    const existingInventory = await this.prisma.inventory.findUnique({
      where: {
        productId_warehouseId: {
          productId: product.id,
          warehouseId: warehouse.id,
        },
      },
    });

    const inventoryData = {
      productId: product.id,
      warehouseId: warehouse.id,
      quantity,
      reservedQty,
      availableQty,
      reorderPoint,
      safetyStock,
    };

    if (existingInventory) {
      await this.prisma.inventory.update({
        where: { id: existingInventory.id },
        data: inventoryData,
      });
    } else {
      await this.prisma.inventory.create({
        data: inventoryData,
      });
    }
  }

  async findAll(skip?: number, take?: number) {
    const [data, total] = await Promise.all([
      this.prisma.dataImport.findMany({
        skip: skip || 0,
        take: take || 1000,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.dataImport.count(),
    ]);

    // Transform to match frontend expectations
    const transformedData = data.map((item) => ({
      id: item.id,
      fileName: item.fileName,
      type: item.type.toLowerCase(),
      status: item.status.toLowerCase(),
      recordsTotal: item.recordsTotal,
      recordsProcessed: item.recordsProcessed,
      recordsFailed: item.recordsFailed,
      uploadedBy: item.uploadedBy,
      uploadedAt: item.uploadedAt.toISOString(),
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

  async findOne(id: number) {
    const importRecord = await this.prisma.dataImport.findUnique({
      where: { id },
    });

    if (!importRecord) {
      throw new NotFoundException(`Data import with ID ${id} not found`);
    }

    return {
      data: {
        id: importRecord.id,
        fileName: importRecord.fileName,
        type: importRecord.type.toLowerCase(),
        status: importRecord.status.toLowerCase(),
        recordsTotal: importRecord.recordsTotal,
        recordsProcessed: importRecord.recordsProcessed,
        recordsFailed: importRecord.recordsFailed,
        uploadedBy: importRecord.uploadedBy,
        uploadedAt: importRecord.uploadedAt.toISOString(),
        completedAt: importRecord.completedAt?.toISOString(),
        errorMessage: importRecord.errorMessage,
        fileUrl: importRecord.fileUrl,
      },
    };
  }

  async update(id: number, updates: any) {
    // Map status and type if provided
    const updateData: any = {};
    if (updates.status) {
      updateData.status = updates.status.toUpperCase();
    }
    if (updates.type) {
      updateData.type = this.mapTypeToEnum(updates.type);
    }
    if (updates.fileName) {
      updateData.fileName = updates.fileName;
    }

    const updated = await this.prisma.dataImport.update({
      where: { id },
      data: updateData,
    });

    return {
      data: {
        id: updated.id,
        fileName: updated.fileName,
        type: updated.type.toLowerCase(),
        status: updated.status.toLowerCase(),
        recordsTotal: updated.recordsTotal,
        recordsProcessed: updated.recordsProcessed,
        recordsFailed: updated.recordsFailed,
        uploadedBy: updated.uploadedBy,
        uploadedAt: updated.uploadedAt.toISOString(),
        completedAt: updated.completedAt?.toISOString(),
        errorMessage: updated.errorMessage,
        fileUrl: updated.fileUrl,
      },
    };
  }

  async remove(id: number) {
    await this.prisma.dataImport.delete({
      where: { id },
    });
    return { id, deleted: true };
  }
}

