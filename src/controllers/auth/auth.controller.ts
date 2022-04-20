/* eslint-disable prettier/prettier */
  import {
    Body,
    Controller,
    Get,
    Post,
    UseGuards,
    Request,
    } from '@nestjs/common';
  import { 
    AuthUpdatePasswordRequest, 
    AuthLoginRequest,
    AuthRegisterRequest,
    AuthForgotRequest,
    AuthVerifyRequest,
    AuthResetPasswordRequest,
  } from 'src/interface/auth.interface';
  import { AuthService } from 'src/services/auth/auth.service';
  import { JwtAuthGuard } from 'src/services/auth/jwt-auth.guard';
  import { UserService } from 'src/services/user/user.service';
import { BaseController } from '../base/base.controller';
  
  @Controller('api/auth')
  export class AuthController extends BaseController {
    constructor(
      private authService: AuthService
    ) {
      super()
    }
  
    @Post('login')
    async login(@Body() params: AuthLoginRequest) {
      const user =  await this.authService.Login(params);
      return this.OKResponse(user)
    }

    @Post('register')
    async register(@Body() params: AuthRegisterRequest) {
      const user =  await this.authService.Register(params);
      return this.OKResponse(user)
    }
  
    @Post('forgot-password')
    async forgotPassword(@Body() params: AuthForgotRequest) {
      const data =  await this.authService.ForgotPassword(params);
      return this.OKResponse(data)
    }

    @Post('reset-password')
    async resetPassword(@Body() params:AuthResetPasswordRequest ) {
      const data =  await this.authService.ResetPassword(params);
      return this.OKResponse(data)
    }
  
    @Post('verify-otp')
    async verify(@Body() params: AuthVerifyRequest) {
      return await this.authService.Verify(params);
    }
  
    @Post('update-password')
    async updatePassword(@Body() params: AuthUpdatePasswordRequest ) {
      const data =  await this.authService.UpdatePassword(params);
      return this.OKResponse(data)
    }

  }
  