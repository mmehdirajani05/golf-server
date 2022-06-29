/* eslint-disable prefer-const */
/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import {
  CACHE_MANAGER,
  HttpException,
  HttpStatus,
  Inject,
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
import { AuthUpdatePassRequestDto } from 'src/dto/authupdatepassrequest.dto';
import { Cache } from 'cache-manager';
import { UserMatchPivotModel } from 'src/models/usermatchpivot.model';
import { NotificationsModel } from 'src/models/notifications.model';

@Injectable()
export class UserService {
  otpCode = '1234';
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,

    @InjectRepository(UserModel)
    public userRepository: Repository<UserModel>,

    @InjectRepository(UserMatchPivotModel)
    public userMatchRepository: Repository<UserMatchPivotModel>,

    @InjectRepository(NotificationsModel)
    public notificationsRepository: Repository<NotificationsModel>,

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
    // Save user token in cache
    await this.cacheManager.set('userToken', token);

    delete user.password

    const response = { ...user, token }

    return { data: response};
  }

  async logout() {
    await this.cacheManager.del('userToken');
    throw new HttpException('User logged out successfully!', HttpStatus.OK)
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
    newUser.first_name = params.first_name.toLowerCase();
    newUser.last_name = params.last_name.toLowerCase();
    newUser.password = passwordHash;
    newUser.email = params.email;
    newUser.is_delete = false;
    newUser.address = params.address
    newUser.state = params.state
    newUser.phone = params.phone

    // create user and access token
    const newUserRes = await this.userRepository.save(newUser);
    const token = this.createSignedToken(newUserRes);
    await this.cacheManager.set('userToken', token);

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

    async UpdatePasswordUser(params: AuthUpdatePassRequestDto) {
      const { email, old_password, new_password } = params;
      const user = await this.userRepository.find({
        where: {
          email: email
        }
      });
      const isMatch = await bcrypt.compare(old_password, user[0].password);
      if(isMatch) {
        const salt = 10
        const passHashed = await bcrypt.hash(new_password, salt)
        const update = await this.userRepository.update(
          { email },
          { password: passHashed },
        );
        return { response: 'Password reset successfully' };
      }
      throw new HttpException('Password not matched', HttpStatus.NOT_FOUND)
      // await bcrypt.compare(old_password, user[0].password, async (err, result) => {
      //   if(result) {
      //     const salt = 10
      //     const passHashed = await bcrypt.hash(new_password, salt)
      //     const update = await this.userRepository.update(
      //       { email },
      //       { password: passHashed },
      //     );
      //     compResult = true
      //   }
      // });
      // if(!compResult) {
      //   return { response: 'Password reset successfully' }; 
      // } else {
      //   throw new HttpException('Password not matched', HttpStatus.NOT_FOUND)
      // }
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
    if (!query.length) return [];
    try {
      const searchedUsers = await this.userRepository
        .createQueryBuilder('u')
        .where("u.first_name LIKE :first_name", {first_name: `%${query}%`})
        .orWhere("u.last_name LIKE :last_name", {last_name: `%${query}%`})
        .getMany();

      return searchedUsers;
    } catch(err) {
      return err;
    }
  }

  async checkUserStatus(matchId) {
    let getUserDetails = await this.userMatchRepository.find({
      relations: ['user'],
      where: {
        match_id: matchId
      }
    })

    if(!getUserDetails.length) {
      throw new HttpException('No user found!', HttpStatus.NOT_FOUND)
    }

    return getUserDetails;

  }

  async getNotifications(userId) {
    let notifications = await this.notificationsRepository.find({
      relations: ['match'],
      where: {
        recipient_id: userId
      }
    })
    if(notifications.length) {
      return notifications
    } else {
      throw new HttpException('No notifications found.', HttpStatus.NOT_FOUND);
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
  