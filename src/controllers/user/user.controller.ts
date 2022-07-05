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

  @Get('check-user-status/:matchId')
  async checkUserStatus(@Param('matchId') matchId) {
    return await this.userService.checkUserStatus(matchId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('get-notifications')
  async getNotifications(@Request() req) {
    return await this.userService.getNotifications(req.user);
  }

  //sample call to test notification
  @Get('notification')
  async matchNotification() {
    return await this.notification.sendMatchInviteNotification(['cUwcmd8VTiCGXRe9DazI1l:APA91bE1lULoRzeKSkcZjZwMAIieiFABRVcNw9gXFNAGOdMpNzfLW7pX3e5qgfkTyEBriIVOkdeUKDzmaABcO4uMIKj0zigpFhfK3AR3EgYfgnpXt1h1U69eRvn5kwOcD6yxbmSv7606']);
  }
}
