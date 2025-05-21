import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { User } from 'generated/prisma';
import { LocalAuthGuard } from 'src/common/guards/local-auth.guard';
import { AuthenticationService } from './authentication.service';
import { Public } from 'src/common/decorators/public.decorator';
import { CreateUserDTO } from '../users/users.dto';

@Controller('auth')
export class AuthenticationController {
  constructor(private authService: AuthenticationService) {}

  @Public()
  @Post('sign-in')
  async register(@Body() createUserDTO: CreateUserDTO) {
    return this.authService.register(createUserDTO);
  }

  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  async login(@Req() req: Request) {
    return this.authService.login(req.user as User);
  }
}
