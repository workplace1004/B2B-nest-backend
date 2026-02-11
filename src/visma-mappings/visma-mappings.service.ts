import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVismaMappingDto, MappingStatus, SyncDirection, Transformation } from './dto/create-visma-mapping.dto';
import { UpdateVismaMappingDto } from './dto/update-visma-mapping.dto';

@Injectable()
export class VismaMappingsService {
  constructor(private prisma: PrismaService) {}

  async create(createVismaMappingDto: CreateVismaMappingDto) {
    // Convert DTO enums to Prisma enums
    const syncDirection = this.mapSyncDirectionToPrisma(
      createVismaMappingDto.syncDirection || SyncDirection.BIDIRECTIONAL
    );
    const transformation = this.mapTransformationToPrisma(
      createVismaMappingDto.transformation || Transformation.NONE
    );
    const status = this.mapStatusToPrisma(
      createVismaMappingDto.status || MappingStatus.PENDING
    );

    const mapping = await this.prisma.vismaMapping.create({
      data: {
        name: createVismaMappingDto.name,
        sourceField: createVismaMappingDto.sourceField,
        targetField: createVismaMappingDto.targetField,
        syncDirection,
        transformation,
        status,
      },
    });

    return { data: this.mapMapping(mapping) };
  }

  async findAll() {
    const mappings = await this.prisma.vismaMapping.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return {
      data: mappings.map((m) => this.mapMapping(m)),
    };
  }

  async findOne(id: number) {
    const mapping = await this.prisma.vismaMapping.findUnique({
      where: { id },
    });

    if (!mapping) {
      throw new NotFoundException(`Visma mapping with ID ${id} not found`);
    }

    return { data: this.mapMapping(mapping) };
  }

  async update(id: number, updateVismaMappingDto: UpdateVismaMappingDto) {
    try {
      const updateData: any = {};

      if (updateVismaMappingDto.name !== undefined) {
        updateData.name = updateVismaMappingDto.name;
      }
      if (updateVismaMappingDto.sourceField !== undefined) {
        updateData.sourceField = updateVismaMappingDto.sourceField;
      }
      if (updateVismaMappingDto.targetField !== undefined) {
        updateData.targetField = updateVismaMappingDto.targetField;
      }
      if (updateVismaMappingDto.syncDirection !== undefined) {
        updateData.syncDirection = this.mapSyncDirectionToPrisma(updateVismaMappingDto.syncDirection);
      }
      if (updateVismaMappingDto.transformation !== undefined) {
        updateData.transformation = this.mapTransformationToPrisma(updateVismaMappingDto.transformation);
      }
      if (updateVismaMappingDto.status !== undefined) {
        updateData.status = this.mapStatusToPrisma(updateVismaMappingDto.status);
      }

      const mapping = await this.prisma.vismaMapping.update({
        where: { id },
        data: updateData,
      });

      return { data: this.mapMapping(mapping) };
    } catch (error) {
      throw new NotFoundException(`Visma mapping with ID ${id} not found`);
    }
  }

  async remove(id: number) {
    try {
      const mapping = await this.prisma.vismaMapping.delete({
        where: { id },
      });

      return { data: this.mapMapping(mapping) };
    } catch (error) {
      throw new NotFoundException(`Visma mapping with ID ${id} not found`);
    }
  }

  // Map Prisma enums to DTO enums
  private mapMapping(mapping: any) {
    return {
      id: mapping.id,
      name: mapping.name,
      sourceField: mapping.sourceField,
      targetField: mapping.targetField,
      syncDirection: this.mapSyncDirectionFromPrisma(mapping.syncDirection),
      transformation: this.mapTransformationFromPrisma(mapping.transformation),
      status: this.mapStatusFromPrisma(mapping.status),
      createdAt: mapping.createdAt.toISOString(),
      updatedAt: mapping.updatedAt.toISOString(),
    };
  }

  // Convert DTO enum to Prisma enum
  private mapSyncDirectionToPrisma(direction: SyncDirection): 'EXPORT' | 'IMPORT' | 'BIDIRECTIONAL' {
    switch (direction) {
      case SyncDirection.EXPORT:
        return 'EXPORT';
      case SyncDirection.IMPORT:
        return 'IMPORT';
      case SyncDirection.BIDIRECTIONAL:
        return 'BIDIRECTIONAL';
      default:
        return 'BIDIRECTIONAL';
    }
  }

  private mapSyncDirectionFromPrisma(direction: string): SyncDirection {
    switch (direction) {
      case 'EXPORT':
        return SyncDirection.EXPORT;
      case 'IMPORT':
        return SyncDirection.IMPORT;
      case 'BIDIRECTIONAL':
        return SyncDirection.BIDIRECTIONAL;
      default:
        return SyncDirection.BIDIRECTIONAL;
    }
  }

  private mapTransformationToPrisma(transformation: Transformation): 'NONE' | 'UPPERCASE' | 'LOWERCASE' | 'TRIM' {
    switch (transformation) {
      case Transformation.NONE:
        return 'NONE';
      case Transformation.UPPERCASE:
        return 'UPPERCASE';
      case Transformation.LOWERCASE:
        return 'LOWERCASE';
      case Transformation.TRIM:
        return 'TRIM';
      default:
        return 'NONE';
    }
  }

  private mapTransformationFromPrisma(transformation: string): Transformation {
    switch (transformation) {
      case 'NONE':
        return Transformation.NONE;
      case 'UPPERCASE':
        return Transformation.UPPERCASE;
      case 'LOWERCASE':
        return Transformation.LOWERCASE;
      case 'TRIM':
        return Transformation.TRIM;
      default:
        return Transformation.NONE;
    }
  }

  private mapStatusToPrisma(status: MappingStatus): 'ACTIVE' | 'INACTIVE' | 'PENDING' {
    switch (status) {
      case MappingStatus.ACTIVE:
        return 'ACTIVE';
      case MappingStatus.INACTIVE:
        return 'INACTIVE';
      case MappingStatus.PENDING:
        return 'PENDING';
      default:
        return 'PENDING';
    }
  }

  private mapStatusFromPrisma(status: string): MappingStatus {
    switch (status) {
      case 'ACTIVE':
        return MappingStatus.ACTIVE;
      case 'INACTIVE':
        return MappingStatus.INACTIVE;
      case 'PENDING':
        return MappingStatus.PENDING;
      default:
        return MappingStatus.PENDING;
    }
  }
}

