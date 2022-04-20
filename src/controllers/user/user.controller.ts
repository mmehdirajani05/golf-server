import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from 'src/services/auth/jwt-auth.guard';
import { UserService } from 'src/services/user/user.service';

@Controller('api/user')
export class UserController {

  constructor(
    private userService: UserService,
  ) {}

  @UseGuards(JwtAuthGuard)
    @Get('me')
    async getUserBytoken(@Request() req) {
      return await this.userService.getUserById(req.user);
    }
}
