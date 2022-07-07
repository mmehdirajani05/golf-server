/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { CACHE_MANAGER, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { 
    AuthUpdatePasswordRequest,
    AuthLoginRequest,
    AuthRegisterRequest,
    AuthForgotRequest,
    AuthVerifyRequest,
    AuthResetPasswordRequest
} from 'src/interface/auth.interface';
import { UserService } from '../user/user.service';
import { HttpModule, HttpService } from '@nestjs/axios';
import { firstValueFrom, lastValueFrom, Observable } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { UserModel } from 'src/models/user.model';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Cache } from 'cache-manager';
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,

    private userService: UserService,

    private httpService: HttpService,

    @InjectRepository(UserModel)
      private userRepository: Repository<UserModel>,

    @Inject(CACHE_MANAGER) private cacheManager: Cache,

    ) {}

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
  
  createSignedToken(user): any {
    const signedUser = this.convertToSingedUser(user);
    return this.jwtService.sign(signedUser);
  }

  convertToSingedUser(user) {
    const { name, id, email } = user;
    return {
      id,
      name,
      email,
    };
  }

  async googleAuthenticate(params) {
    let googleData = await this.httpService.get('https://www.googleapis.com/oauth2/v3/tokeninfo?id_token='+params.token).toPromise();
    if(googleData.data.email) {
      let getUserDet = await this.userRepository.find({
        where: {
          email: googleData.data.email
        }
      })
      if(getUserDet.length) {
        // create a access token
        const token = this.createSignedToken(getUserDet[0]);
        // Save user token in cache
        await this.cacheManager.set('userToken', token);
        throw new HttpException({data: token}, HttpStatus.OK);;
      } else {
        let createUser = this.userRepository.create({
          first_name: googleData.data.given_name,
          last_name: googleData.data.family_name,
          email: googleData.data.email
        });
        await this.userRepository.save(createUser);
        // create a access token
        const token = this.createSignedToken(createUser);
        // Save user token in cache
        await this.cacheManager.set('userToken', token);
        throw new HttpException({data: token}, HttpStatus.OK);
      }
    } else {
      throw new HttpException('Access token not valid', HttpStatus.BAD_REQUEST);
    }
  }

  async fbSocialLogin(params) {
    let fbData = await this.httpService.get('https://graph.facebook.com/v14.0/me?fields=id%2Cname%2Cemail%2Cfirst_name%2Clast_name&access_token='+params.token).toPromise();
    console.log(fbData.data);
    if(fbData.data.email) {
      let getUserDet = await this.userRepository.find({
        where: {
          email: fbData.data.email
        }
      })
      if(getUserDet.length) {
        // create a access token
        const token = this.createSignedToken(getUserDet[0]);
        // Save user token in cache
        await this.cacheManager.set('userToken', token);
        throw new HttpException({data: token}, HttpStatus.OK);;
      } else {
        let createUser = this.userRepository.create({
          first_name: fbData.data.first_name,
          last_name: fbData.data.last_name,
          email: fbData.data.email
        });
        await this.userRepository.save(createUser);
        // create a access token
        const token = this.createSignedToken(createUser);
        // Save user token in cache
        await this.cacheManager.set('userToken', token);
        throw new HttpException({data: token}, HttpStatus.OK);
      }
    } else {
      throw new HttpException('Access token not valid', HttpStatus.BAD_REQUEST);
    }
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
