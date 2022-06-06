/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { IsEmail, IsInt, IsString } from 'class-validator';


export class AuthRegisterRequestDto {

    @IsEmail()
    email: string;

    @IsString()
    password: string;

    @IsString()
    first_name: string;

    @IsString()
    last_name: string;

    @IsString()
    address: string;

    @IsString()
    state: string;

    @IsString()
    phone: string;

}