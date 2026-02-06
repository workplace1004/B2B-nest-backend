import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateApiKeyDto } from './dto/create-api-key.dto';
import { UpdateApiKeyDto } from './dto/update-api-key.dto';
import * as crypto from 'crypto';

@Injectable()
export class ApiKeysService {
  constructor(private prisma: PrismaService) {}

  // Hash the key before storing (in production, use proper encryption)
  private hashKey(key: string): string {
    return crypto.createHash('sha256').update(key).digest('hex');
  }

  async create(createApiKeyDto: CreateApiKeyDto) {
    // Check if key already exists
    const hashedKey = this.hashKey(createApiKeyDto.key);
    const existing = await this.prisma.apiKey.findUnique({
      where: { key: hashedKey },
    });

    if (existing) {
      throw new BadRequestException('API key already exists');
    }

    // Create API key with hashed key
    const apiKey = await this.prisma.apiKey.create({
      data: {
        ...createApiKeyDto,
        key: hashedKey,
        permissions: createApiKeyDto.permissions || [],
        isActive: createApiKeyDto.isActive ?? true,
        expiresAt: createApiKeyDto.expiresAt ? new Date(createApiKeyDto.expiresAt) : null,
      },
    });

    // Return with original key for display (in production, only return on creation)
    return {
      ...apiKey,
      key: createApiKeyDto.key, // Return original key only on creation
    };
  }

  async findAll(skip?: number, take?: number, type?: string) {
    const where: any = {};
    if (type && type !== 'all') {
      where.type = type.toUpperCase().replace('-', '_');
    }

    const [data, total] = await Promise.all([
      this.prisma.apiKey.findMany({
        skip: skip,
        take: take,
        where,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.apiKey.count({ where }),
    ]);

    // Mask keys for security (only show partial key)
    const apiKeys = data.map((key) => ({
      ...key,
      key: this.maskKey(key.key),
    }));

    return {
      data: apiKeys,
      total,
      skip: skip || 0,
      take: take || apiKeys.length,
    };
  }

  async findOne(id: number) {
    const apiKey = await this.prisma.apiKey.findUnique({
      where: { id },
    });

    if (!apiKey) {
      throw new NotFoundException(`API key with ID ${id} not found`);
    }

    // Mask key for security
    return {
      ...apiKey,
      key: this.maskKey(apiKey.key),
    };
  }

  async update(id: number, updateApiKeyDto: UpdateApiKeyDto) {
    const apiKey = await this.findOne(id);

    const updateData: any = { ...updateApiKeyDto };

    // If key is being updated, hash it
    if (updateApiKeyDto.key) {
      const hashedKey = this.hashKey(updateApiKeyDto.key);
      // Check if new key already exists
      const existing = await this.prisma.apiKey.findUnique({
        where: { key: hashedKey },
      });

      if (existing && existing.id !== id) {
        throw new BadRequestException('API key already exists');
      }
      updateData.key = hashedKey;
    }

    // Handle date conversion
    if (updateApiKeyDto.expiresAt) {
      updateData.expiresAt = new Date(updateApiKeyDto.expiresAt);
    }

    const updated = await this.prisma.apiKey.update({
      where: { id },
      data: updateData,
    });

    // Return with masked key
    return {
      ...updated,
      key: updateApiKeyDto.key ? updateApiKeyDto.key : this.maskKey(updated.key),
    };
  }

  async remove(id: number) {
    const apiKey = await this.findOne(id);
    
    await this.prisma.apiKey.delete({
      where: { id },
    });

    return {
      ...apiKey,
      key: this.maskKey(apiKey.key),
    };
  }

  async updateLastUsed(id: number) {
    await this.prisma.apiKey.update({
      where: { id },
      data: { lastUsed: new Date() },
    });
  }

  // Mask key for display (show first 10 chars and last 4 chars)
  private maskKey(key: string): string {
    if (key.length <= 14) {
      return '***' + key.slice(-4);
    }
    return key.slice(0, 10) + '...' + key.slice(-4);
  }
}

