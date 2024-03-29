/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
  import { HttpService } from '@nestjs/axios';
import {
    Body,
    Controller,
    Get,
    Post,
    UseGuards,
    Request,
    Req,
    Res,
    } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthForgetRequestDto } from 'src/dto/authforgetrequest.dto';
import { AuthLoginRequestDto } from 'src/dto/authloginrequest.dto';
import { AuthRegisterRequestDto } from 'src/dto/authregisterrequest.dto';
import { AuthResetPassRequestDto } from 'src/dto/authresetpassrequest.dto';
import { AuthUpdatePassRequestDto } from 'src/dto/authupdatepassrequest.dto';
import { AuthVerifyRequestDto } from 'src/dto/authverifyrequest.dto';
import { SocialLoginDto } from 'src/dto/sociallogin.dto';
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
  
  @ApiTags('Authentication Settings')
  @Controller('api/auth')
  export class AuthController extends BaseController {
    constructor(
      private authService: AuthService
    ) {
      super()
    }
  
    @Post('login')
    async login(@Body() params: AuthLoginRequestDto) {
      const user =  await this.authService.Login(params);
      return this.OKResponse(user)
    }

    @Post('signout')
    async userLogout() {
      return await this.authService.logout();
    }

    @Post('register')
    async register(@Body() params: AuthRegisterRequestDto) {
      const user =  await this.authService.Register(params);
      return this.OKResponse(user)
    }
  
    @Post('forgot-password')
    async forgotPassword(@Body() params: AuthForgetRequestDto) {
      const data =  await this.authService.ForgotPassword(params);
      return this.OKResponse(data)
    }

    @Post('reset-password')
    async resetPassword(@Body() params:AuthResetPassRequestDto ) {
      const data =  await this.authService.ResetPassword(params);
      return this.OKResponse(data)
    }
  
    @Post('verify-otp')
    async verify(@Body() params: AuthVerifyRequestDto) {
      return await this.authService.Verify(params);
    }
  
    @Post('update-password')
    async updatePassword(@Body() params: AuthUpdatePassRequestDto ) {
      const data =  await this.authService.UpdatePassword(params);
      return this.OKResponse(data)
    }

    @Post('google-login')
    async socialLogin(@Body() params: SocialLoginDto, @Res() response: Response) {
      const data =  await this.authService.googleAuthenticate(params);
      return this.OKResponse(data);
    }

    @Post('fb-login')
    async fbSocialLogin(@Body() params: SocialLoginDto, @Res() response: Response) {
      const data =  await this.authService.fbSocialLogin(params);
      return this.OKResponse(data);
    }

    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req) {}

    @Get('google/redirect')
    @UseGuards(AuthGuard('google'))
    googleAuthRedirect(@Req() req) {
      return this.authService.googleLogin(req)
    }

  }
  