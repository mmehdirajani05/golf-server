/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { IsEmail, IsInt, IsString } from 'class-validator';


export class SocialLoginDto {

    @IsString()
    token: string;

    @IsString()
    type: string;

}