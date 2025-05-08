import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, ResponseMessage } from 'src/decorator/custom';
import { LocalAuthGuard } from './passport/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) { }

  @Post('login')
  @Public()
  @UseGuards(LocalAuthGuard)
  @ResponseMessage('Login success')
  handleLogin(@Request() req) {
    return this.authService.login(req.user);
  }

}
