/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { IsEmail, IsInt, IsString } from 'class-validator';


export class AuthUpdatePassRequestDto {

    @IsEmail()
    email: string;

    @IsString()
    old_password: string;

    @IsString()
    new_password: string;

}