import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

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
        // Update status to PROCESSING
        await this.prisma.dataExport.update({
          where: { id: exportId },
          data: { status: 'PROCESSING' },
        });

        // Simulate processing time (5 seconds)
        setTimeout(async () => {
          try {
            // Generate mock data
            const mockRecordsCount = Math.floor(Math.random() * 1000) + 100;
            const mockFileSize = mockRecordsCount * 1024; // Approximate file size
            const fileName = `export-${exportId}.${await this.getExportFormat(exportId)}`;
            
            // Update status to COMPLETED
            await this.prisma.dataExport.update({
              where: { id: exportId },
              data: {
                status: 'COMPLETED',
                recordsCount: mockRecordsCount,
                fileSize: mockFileSize,
                fileUrl: `/exports/${fileName}`,
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
        }, 5000); // 5 seconds processing time
      } catch (error) {
        console.error(`Error processing export ${exportId}:`, error);
      }
    }, 2000); // 2 seconds delay before starting processing
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

