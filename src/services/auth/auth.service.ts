/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { 
    AuthUpdatePasswordRequest,
    AuthLoginRequest,
    AuthRegisterRequest,
    AuthForgotRequest,
    AuthVerifyRequest,
    AuthResetPasswordRequest
} from 'src/interface/auth.interface';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async Login(params: AuthLoginRequest) {
    return await this.userService.VerifyEmailPassword(params);
  }
  async logout() {
    return await this.userService.logout();
  }

  async ForgotPassword(params: AuthForgotRequest) {
    return await this.userService.ForgotUser(params);
  }

  async Verify(params: AuthVerifyRequest) {
    return await this.userService.VerifyUser(params);
  }

  async ResetPassword(params: AuthResetPasswordRequest ) {
    return await this.userService.ResetPasswordUser(params);
  }

  async UpdatePassword(params: AuthUpdatePasswordRequest) {
    return await this.userService.UpdatePasswordUser(params);
  }
  
  async Register(params: AuthRegisterRequest) {
    return await this.userService.CreateUser(params);
  }

  async socialLogin(params) {
    return 
  }

  googleLogin(req) {
    if (!req.user) {
      return 'No user from google'
    }

    return {
      message: 'User information from google',
      user: req.user
    }
  }

}
