import { IsNotEmpty, IsString } from 'class-validator';


export class AddUserDevice {

  @IsString()
  @IsNotEmpty()
  public fcm_id: string;

  @IsString()
  public uuid: string;

  @IsString()
  public os: string;


}