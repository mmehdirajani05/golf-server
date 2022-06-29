/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Controller, Get, UseGuards, Request, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from 'src/dto/updateuser.dto';
import { JwtAuthGuard } from 'src/services/auth/jwt-auth.guard';
import { NotificationService } from 'src/services/notification/notification.service';
import { UserService } from 'src/services/user/user.service';

@ApiTags('User Management')
@Controller('api/user')
export class UserController  {

  constructor(
    private userService: UserService,
    private notification: NotificationService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getUserBytoken(@Request() req) {
    return await this.userService.getUserById(req.user);
  }

  @Post(':id')
  async updateUser(@Body() user: UpdateUserDto, @Param() id) {
    return await this.userService.updateUserById(user, id);
  }

  @Get('search-user')
  async searchUser(@Query('search_str') query) {
    return await this.userService.searchUser(query);
  }

  @Get('notification')
  async matchNotification() {
    return await this.notification.sendMatchInviteNotification('eBkpxEhTTTCoeE4jZ9ikMl:APA91bH_uqIKXT8otcF_TkE_WfIOc-_zB4jiuOIqUso288j8DfyTY73gZ2yPC8FJkbQh6COQQ5iZc5OOMh0ruflWiLFBfub55p9OSJ52uHmZFf6tMgoRTGKIdpFSUyvf1JQCwXSuJ26_');
  }
}
