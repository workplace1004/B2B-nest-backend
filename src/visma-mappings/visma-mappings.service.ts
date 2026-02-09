import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVismaMappingDto, MappingStatus, SyncDirection, Transformation } from './dto/create-visma-mapping.dto';
import { UpdateVismaMappingDto } from './dto/update-visma-mapping.dto';

export interface VismaMapping {
  id: number;
  name: string;
  sourceField: string;
  targetField: string;
  syncDirection: SyncDirection;
  transformation: Transformation;
  status: MappingStatus;
  createdAt: string;
  updatedAt: string;
}

@Injectable()
export class VismaMappingsService {
  private mappings: VismaMapping[] = [];
  private nextId = 1;

  create(createVismaMappingDto: CreateVismaMappingDto) {
    const mapping: VismaMapping = {
      id: this.nextId++,
      name: createVismaMappingDto.name,
      sourceField: createVismaMappingDto.sourceField,
      targetField: createVismaMappingDto.targetField,
      syncDirection: createVismaMappingDto.syncDirection || SyncDirection.BIDIRECTIONAL,
      transformation: createVismaMappingDto.transformation || Transformation.NONE,
      status: createVismaMappingDto.status || MappingStatus.PENDING,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.mappings.push(mapping);
    return { data: mapping };
  }

  findAll() {
    return {
      data: this.mappings.map((m) => this.mapMapping(m)),
    };
  }

  findOne(id: number) {
    const mapping = this.mappings.find((m) => m.id === id);
    if (!mapping) {
      throw new NotFoundException(`Visma mapping with ID ${id} not found`);
    }
    return { data: this.mapMapping(mapping) };
  }

  update(id: number, updateVismaMappingDto: UpdateVismaMappingDto) {
    const index = this.mappings.findIndex((m) => m.id === id);
    if (index === -1) {
      throw new NotFoundException(`Visma mapping with ID ${id} not found`);
    }

    const mapping = this.mappings[index];
    const updated = {
      ...mapping,
      ...updateVismaMappingDto,
      updatedAt: new Date().toISOString(),
    };

    this.mappings[index] = updated;
    return { data: this.mapMapping(updated) };
  }

  remove(id: number) {
    const index = this.mappings.findIndex((m) => m.id === id);
    if (index === -1) {
      throw new NotFoundException(`Visma mapping with ID ${id} not found`);
    }

    const mapping = this.mappings[index];
    this.mappings.splice(index, 1);
    return { data: this.mapMapping(mapping) };
  }

  private mapMapping(mapping: VismaMapping) {
    return {
      id: mapping.id,
      name: mapping.name,
      sourceField: mapping.sourceField,
      targetField: mapping.targetField,
      syncDirection: mapping.syncDirection,
      transformation: mapping.transformation,
      status: mapping.status,
      createdAt: mapping.createdAt,
      updatedAt: mapping.updatedAt,
    };
  }
}

