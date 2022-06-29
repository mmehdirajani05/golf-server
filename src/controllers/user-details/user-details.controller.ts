import { Body, Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AddUserDevice } from 'src/dto/user-details.dto';
import { JwtAuthGuard } from 'src/services/auth/jwt-auth.guard';
import { UserDetailsService } from 'src/services/user-details/user-details.service';
import { BaseController } from '../base/base.controller';


@ApiTags('User device')
@Controller('api/user-details')
export class UserDetailsController extends BaseController {

  constructor(
    private userDetailsService: UserDetailsService,
  ) {
    super()
  }

    // @UseGuards(JwtAuthGuard)
    @Post('')
    async AddUserDevice(
      @Body() addUserDetails: AddUserDevice,
      @Request() req
    ) {
      const data  = await  this.userDetailsService.addUserDeviceDetails(addUserDetails, 2)
      return this.OKResponse(data)
    }

    // @UseGuards(JwtAuthGuard)
    @Get('')
    async GetUserDevice(
      @Request() req
    ) {
      const data  = await this.userDetailsService.getUserDeviceDetails(2)
      console.log('data', data)
      return this.OKResponse(data)
    }
}
