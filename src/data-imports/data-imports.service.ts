import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Express } from 'express';

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
        // Update status to PROCESSING
        await this.prisma.dataImport.update({
          where: { id: importId },
          data: { status: 'PROCESSING' },
        });

        // Simulate processing time (5 seconds) with progress updates
        const totalRecords = Math.floor(Math.random() * 500) + 50;
        let processedRecords = 0;
        const failedRecords = Math.floor(Math.random() * 5); // 0-4 failed records

        // Update total records
        await this.prisma.dataImport.update({
          where: { id: importId },
          data: { recordsTotal: totalRecords },
        });

        // Simulate progressive processing
        const interval = setInterval(async () => {
          processedRecords += Math.floor(Math.random() * 20) + 5;
          if (processedRecords >= totalRecords) {
            processedRecords = totalRecords;
            clearInterval(interval);
            
            // Complete the import
            await this.prisma.dataImport.update({
              where: { id: importId },
              data: {
                status: 'COMPLETED',
                recordsProcessed: processedRecords,
                recordsFailed: failedRecords,
                completedAt: new Date(),
              },
            });
          } else {
            // Update progress
            await this.prisma.dataImport.update({
              where: { id: importId },
              data: {
                recordsProcessed: processedRecords,
                recordsFailed: failedRecords,
              },
            });
          }
        }, 500); // Update every 500ms

        // Safety timeout - complete after 5 seconds max
        setTimeout(async () => {
          clearInterval(interval);
          const finalRecord = await this.prisma.dataImport.findUnique({
            where: { id: importId },
          });
          
          if (finalRecord && finalRecord.status === 'PROCESSING') {
            await this.prisma.dataImport.update({
              where: { id: importId },
              data: {
                status: 'COMPLETED',
                recordsProcessed: totalRecords,
                recordsFailed: failedRecords,
                completedAt: new Date(),
              },
            });
          }
        }, 5000);
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
    }, 2000); // 2 seconds delay before starting processing
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

