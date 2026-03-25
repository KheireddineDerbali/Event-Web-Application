import { Controller, Post, Param, UseGuards, Request } from '@nestjs/common';
import { RegistrationsService } from './registrations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('events') // as requested: POST /events/:id/register
export class RegistrationsController {
  constructor(private readonly registrationsService: RegistrationsService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':id/register')
  async register(@Param('id') eventId: string, @Request() req: any) {
    const userId = req.user.id;
    return this.registrationsService.register(eventId, userId);
  }
}
