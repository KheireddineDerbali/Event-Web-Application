import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.event.findMany({
      orderBy: { date: 'asc' },
    });
  }

  async create(createEventDto: CreateEventDto) {
    return this.prisma.event.create({
      data: {
        title: createEventDto.title,
        description: createEventDto.description,
        date: new Date(createEventDto.date),
        location: createEventDto.location,
      },
    });
  }

  async update(id: string, updateEventDto: UpdateEventDto) {
    try {
      return await this.prisma.event.update({
        where: { id },
        data: {
          ...updateEventDto,
          date: updateEventDto.date ? new Date(updateEventDto.date) : undefined,
        },
      });
    } catch (error) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.event.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
  }

  async getClients(eventId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: {
        registrations: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }

    return event.registrations.map(reg => reg.user);
  }
}
