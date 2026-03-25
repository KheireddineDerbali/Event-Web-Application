import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RegistrationsService {
  constructor(private prisma: PrismaService) {}

  async register(eventId: string, userId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }

    try {
      return await this.prisma.registration.create({
        data: {
          eventId,
          userId,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') { // Prisma Unique Constraint Violation
        throw new ConflictException('User is already registered for this event');
      }
      throw error;
    }
  }
}
