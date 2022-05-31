/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Controller, Get, UseGuards, Request, Post, Body, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from 'src/dto/updateuser.dto';
import { JwtAuthGuard } from 'src/services/auth/jwt-auth.guard';
import { UserService } from 'src/services/user/user.service';

@ApiTags('User Management')
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

  @Post(':id')
  async updateUser(@Body() user: UpdateUserDto, @Param() id) {
    return await this.userService.getUserupdateUserById(user, id);
  }
}
