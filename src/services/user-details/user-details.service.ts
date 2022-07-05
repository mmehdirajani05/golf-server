/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageText } from 'src/constants/messages';
import { AddUserDevice } from 'src/dto/user-details.dto';
import { UserDetailsModel } from 'src/models/user-details.model';
import { Repository } from 'typeorm';

@Injectable()
export class UserDetailsService {

  constructor(
    @InjectRepository(UserDetailsModel)
    public userDeviceRepository: Repository<UserDetailsModel>,
  ) {}


  async addUserDeviceDetails(params: AddUserDevice, userId: number) {
    const userDevice = await this.userDeviceRepository.findOne({user_id: userId})

    if (userDevice) {
      await this.userDeviceRepository.update(userDevice.id, params);
      return 
    }
    
    try {
      const device = await this.userDeviceRepository.create({
        ...params,
        user_id: userId
      })
      await this.userDeviceRepository.save(device);
      return  {data: device}

    } catch {
      throw new HttpException(MessageText.serverError, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getUserDeviceDetails(userId: number) {

    try {
      const device = await this.userDeviceRepository.findOne({user_id: userId})
      
      if (!device)  {
        return {data: {}}
      } 
      return  {data: device}
    } catch {
      throw new HttpException(MessageText.serverError, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
  }
}
