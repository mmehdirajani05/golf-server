/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import {
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { 
  AuthForgotRequest, 
  AuthLoginRequest, 
  AuthRegisterRequest, 
  AuthResetPasswordRequest, 
  AuthUpdatePasswordRequest, 
  AuthVerifyRequest 
} from 'src/interface/auth.interface';
import { UserModel } from 'src/models/user.model';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { MessageText } from 'src/constants/messages';
import { UpdateUserDto } from 'src/dto/updateuser.dto';

@Injectable()
export class UserService {
  otpCode = '1234';
  constructor(
    @InjectRepository(UserModel)
    private userRepository: Repository<UserModel>,
    private readonly jwtService: JwtService,
  ) {}

  async VerifyEmailPassword(params: AuthLoginRequest) {
    const emailParams = { email: params.email };
    const user = await this.CheckUserExistByEmail(emailParams);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const isPasswordMatch = await bcrypt.compare(params.password, user.password);

    if (!isPasswordMatch) {
      throw new HttpException('Invalid password', HttpStatus.NOT_FOUND);
    }

    // create a access token
    const token = this.createSignedToken(user);

    delete user.password

    const response = { ...user, token }

    return { data: response};
  }

  async CheckUserExistByEmail(params: { email: string }) {
    const user = await this.userRepository.findOne({
      ...params,
      is_delete: false,
    }, 
    { select:[
        'first_name',
        'first_name',
        'id',
        'avatar',
        'address',
        'password',
        'state',
        'phone',
        'email'
      ]
    });

    if(!user){
      return false
    }
    // const signedAvatar = user?.avatar ? await GetAWSSignedUrl(user.avatar) : ""
    // return {...user, avatar: signedAvatar};
    return {...user};
    
  }

  async CreateUser(params: AuthRegisterRequest) {
    const emailParams = { email: params.email };
    const user = await this.CheckUserExistByEmail(emailParams);

    if (!!user) {
      throw new HttpException(
        MessageText.userExist,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const passwordHash = await this.createPasswordHash(params.password || '')

    const newUser = new UserModel();
    newUser.first_name = params.first_name;
    newUser.last_name = params.last_name;
    newUser.password = passwordHash;
    newUser.email = params.email;
    newUser.is_delete = false;
    newUser.address = params.address
    newUser.state = params.state
    newUser.phone = params.phone

    // create user and access token
    const newUserRes = await this.userRepository.save(newUser);
    const token = this.createSignedToken(newUserRes);

    if (newUserRes.password) {
      delete newUserRes.password;
    }

    const response = { ...newUserRes, token }

    return { data: response};
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

  async ForgotUser(params: AuthForgotRequest) {
    const emailParams = { email: params.email };
    const forgotUser = await this.userRepository.findOne(emailParams);
    if (!forgotUser) {
      throw new HttpException(MessageText.invalidEmail , HttpStatus.NOT_FOUND);
    } 
    return { message: MessageText.codeEmail }
  }

  async ResetPasswordUser(params: AuthResetPasswordRequest) {
    const { email, new_password, code } = params;
    
    if (code !== this.otpCode) {
      throw new HttpException(MessageText.invalidCode, HttpStatus.NOT_ACCEPTABLE); 
    }
    
    const user = await this.userRepository.findOne({ email });

    if (!user) {
      throw new HttpException(MessageText.invalidEmail, HttpStatus.NOT_FOUND);
    }

    const updatedUser = await this.userRepository.update({ email }, { password: new_password });
    return { data: updatedUser, message: MessageText.passwordSuccess };
  }

  async VerifyUser(params: AuthVerifyRequest) {
    const { code } = params;
    if (this.otpCode === code) {
      return { response: 'verified' };
    } else {
      throw new HttpException('Code is expired please retry.', HttpStatus.NOT_FOUND);
    }
  }

    async UpdatePasswordUser(params: AuthUpdatePasswordRequest) {
    const { email, old_password, new_password } = params;
    const user = await this.userRepository.findOne({
      email,
      password: old_password,
    });
    if (user) {
      const update = await this.userRepository.update(
        { email },
        { password: new_password },
      );
      return { user: update, response: 'Password reset successfully' };
    } else {
      throw new HttpException('Password not matched', HttpStatus.NOT_FOUND);
    }
  }

  async getUserById(id: string) {
    const user = await this.userRepository.findOne({ id });
    if (user) {
      // const signedAvatar = user.avatar ? await GetAWSSignedUrl(user.avatar) : ""
      // return {...user, avatar: signedAvatar};
      return {...user};
    }
    throw new HttpException(
      'User with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async createPasswordHash(password: string) {
    const salt = 10
    return await bcrypt.hash(password, salt)
  }

  async updateUserById(user: UpdateUserDto, id) {
    try {
      const userToUpdate = await this.userRepository.findOne(id)
      if(userToUpdate){
        await this.userRepository.update(id, user)
        const updatedUser = await this.userRepository.findOne(id)
        if(updatedUser){
          return {
            response: 'User updated successfully!',
            data: updatedUser
          }
        }
      } else {
        return {
          response: 'User doesnt exist'
        }
      }
    } catch(err) {
      return err;
    }
  }

  async searchUser(query) {
    try {
      if(query) {
        const searchedUsers = await this.userRepository.createQueryBuilder('u')
                                                      .where("u.first_name LIKE :first_name", {first_name: `%${query}%`})
                                                      .orWhere("u.last_name LIKE :last_name", {last_name: `%${query}%`})
                                                      .getMany();
        if(searchedUsers.length) {
          return searchedUsers;
        } else {
          return {
            error: "Users not found!"
          }
        }
      } else {
        return {
          error: "Users not found!"
        }
      }
    } catch(err) {
      return err;
    }
  }

  // async addAvatar(userId: string, imageBuffer: Buffer, filename: string) {
  //   const avatar = await this.filesService.uploadPublicFile(
  //     imageBuffer,
  //     filename,
  //   );
  //   const user = await this.getUserById(userId);
  //   await this.userRepository.update({ id: userId }, { ...user, avatar });
  //   const getURL = await GetAWSSignedUrl(avatar)
  //   return {url:getURL} ;
  // }

  // async updateUser(userId: string, updateUser: UserUpdate) {
  //   const user = await this.userRepository.findOne({ id: userId });
  //   if (user) {
  //     const signedAvatar = user.avatar ? await GetAWSSignedUrl(user.avatar) : ""
  //     await this.userRepository.update({ id: userId }, { ...updateUser });
  //     return { user: {...user, ...updateUser, avatar: signedAvatar}, response: 'User updated successfully' };
  //   } else {
  //     throw new HttpException('User is not exist', HttpStatus.NOT_FOUND);
  //   }
  // }
}
  