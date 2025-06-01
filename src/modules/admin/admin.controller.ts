import { Controller, Get } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Roles(Role.ADMIN)
  @Get('reservations')
  async adminReservations() {
    return this.adminService.adminGetReservations();
  }
}
