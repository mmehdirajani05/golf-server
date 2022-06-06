/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { IsEmail, IsInt, IsString } from 'class-validator';


export class AuthResetPassRequestDto {

    @IsString()
    code: string;

    @IsEmail()
    email: string;

    @IsString()
    new_password: string;

}