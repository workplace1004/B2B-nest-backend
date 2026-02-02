import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { UpdateAlertDto } from './dto/update-alert.dto';

@Injectable()
export class AlertsService {
  constructor(private prisma: PrismaService) {}

  async create(createAlertDto: CreateAlertDto) {
    const alert = await this.prisma.alert.create({
      data: createAlertDto,
    });

    return alert;
  }

  async findAll(skip?: number, take?: number, type?: string, status?: string, severity?: string) {
    const where: any = {};
    if (type) {
      where.type = type;
    }
    if (status) {
      where.status = status;
    }
    if (severity) {
      where.severity = severity;
    }

    const alerts = await this.prisma.alert.findMany({
      skip,
      take,
      where,
      orderBy: [
        { severity: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    return alerts;
  }

  async findOne(id: number) {
    const alert = await this.prisma.alert.findUnique({
      where: { id },
    });

    if (!alert) {
      throw new NotFoundException(`Alert with ID ${id} not found`);
    }

    return alert;
  }

  async update(id: number, updateAlertDto: UpdateAlertDto) {
    const existingAlert = await this.findOne(id);

    const updateData: any = { ...updateAlertDto };

    // Auto-set acknowledgedAt when status changes to ACKNOWLEDGED
    if (updateAlertDto.status === 'ACKNOWLEDGED' && existingAlert.status !== 'ACKNOWLEDGED' && !existingAlert.acknowledgedAt) {
      updateData.acknowledgedAt = new Date();
    }

    // Auto-set resolvedAt when status changes to RESOLVED
    if (updateAlertDto.status === 'RESOLVED' && existingAlert.status !== 'RESOLVED' && !existingAlert.resolvedAt) {
      updateData.resolvedAt = new Date();
    }

    const alert = await this.prisma.alert.update({
      where: { id },
      data: updateData,
    });

    return alert;
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.alert.delete({
      where: { id },
    });
    return { message: 'Alert deleted successfully' };
  }
}

