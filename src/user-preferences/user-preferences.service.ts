import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserPreferenceDto } from './dto/create-user-preference.dto';
import { UpdateUserPreferenceDto } from './dto/update-user-preference.dto';

@Injectable()
export class UserPreferencesService {
  constructor(private prisma: PrismaService) {}

  async create(createUserPreferenceDto: CreateUserPreferenceDto) {
    return this.prisma.userPreference.upsert({
      where: {
        userId_key: {
          userId: createUserPreferenceDto.userId || null,
          key: createUserPreferenceDto.key,
        },
      },
      update: {
        value: createUserPreferenceDto.value,
      },
      create: createUserPreferenceDto,
    });
  }

  async findAll(userId?: number) {
    return this.prisma.userPreference.findMany({
      where: userId ? { userId } : { userId: null },
    });
  }

  async findOne(key: string, userId?: number) {
    return this.prisma.userPreference.findUnique({
      where: {
        userId_key: {
          userId: userId || null,
          key,
        },
      },
    });
  }

  async update(key: string, updateUserPreferenceDto: UpdateUserPreferenceDto, userId?: number) {
    return this.prisma.userPreference.update({
      where: {
        userId_key: {
          userId: userId || null,
          key,
        },
      },
      data: updateUserPreferenceDto,
    });
  }

  async remove(key: string, userId?: number) {
    return this.prisma.userPreference.delete({
      where: {
        userId_key: {
          userId: userId || null,
          key,
        },
      },
    });
  }

  async getValue(key: string, userId?: number, defaultValue?: string): Promise<string> {
    const preference = await this.findOne(key, userId);
    return preference?.value || defaultValue || '';
  }
}

