/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { IsEmail, IsInt, IsString } from 'class-validator';


export class AuthLoginRequestDto {

    @IsEmail()
    email: string;

    @IsString()
    password: string;

}