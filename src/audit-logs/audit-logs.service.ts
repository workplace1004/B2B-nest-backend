import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditLogsService {
  constructor(private prisma: PrismaService) {}

  async findAll(skip?: number, take?: number) {
    const [data, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        skip: skip || 0,
        take: take || 1000,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      }),
      this.prisma.auditLog.count(),
    ]);

    return {
      data,
      total,
      skip: skip || 0,
      take: take || 1000,
    };
  }

  async findOne(id: number) {
    const auditLog = await this.prisma.auditLog.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!auditLog) {
      return null;
    }

    return auditLog;
  }
}

