import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  async create(createRoleDto: CreateRoleDto) {
    // Check if role name already exists
    const existingRole = await this.prisma.role.findUnique({
      where: { name: createRoleDto.name },
    });

    if (existingRole) {
      throw new BadRequestException('Role with this name already exists');
    }

    return this.prisma.role.create({
      data: {
        name: createRoleDto.name,
        description: createRoleDto.description,
        permissions: createRoleDto.permissions,
        isSystemRole: createRoleDto.isSystemRole || false,
      },
    });
  }

  async findAll(skip?: number, take?: number) {
    const [data, total] = await Promise.all([
      this.prisma.role.findMany({
        skip: skip,
        take: take,
        orderBy: [
          { isSystemRole: 'desc' },
          { name: 'asc' },
        ],
        include: {
          _count: {
            select: { users: true },
          },
        },
      }),
      this.prisma.role.count(),
    ]);

    // Map to include userCount
    const roles = data.map((role) => ({
      ...role,
      userCount: role._count.users,
    }));

    return {
      data: roles,
      total,
      skip: skip || 0,
      take: take || roles.length,
    };
  }

  async findOne(id: number) {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: {
        _count: {
          select: { users: true },
        },
      },
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    return {
      ...role,
      userCount: role._count.users,
    };
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const role = await this.findOne(id);

    if (role.isSystemRole && (updateRoleDto.name || updateRoleDto.isSystemRole === false)) {
      throw new BadRequestException('Cannot modify system role name or convert system role to custom');
    }

    // Check if name is being changed and if new name already exists
    if (updateRoleDto.name && updateRoleDto.name !== role.name) {
      const existingRole = await this.prisma.role.findUnique({
        where: { name: updateRoleDto.name },
      });

      if (existingRole) {
        throw new BadRequestException('Role with this name already exists');
      }
    }

    return this.prisma.role.update({
      where: { id },
      data: updateRoleDto,
    });
  }

  async remove(id: number) {
    const role = await this.findOne(id);

    if (role.isSystemRole) {
      throw new BadRequestException('Cannot delete system roles');
    }

    // Check if role has assigned users
    if (role.userCount > 0) {
      throw new BadRequestException('Cannot delete role with assigned users');
    }

    return this.prisma.role.delete({
      where: { id },
    });
  }
}

