/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { IsEmail, IsInt, IsString } from 'class-validator';


export class AuthVerifyRequestDto {

    @IsString()
    code: string;

    @IsEmail()
    email: string;

}