/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsDefined, IsInt, IsOptional, IsString } from 'class-validator';


export class UpdateUserDto {

    // @IsInt()
    // public id: number;

    @IsString()
    @IsOptional()
    public first_name: string;

    @IsString()
    @IsOptional()
    public last_name: string;

    @IsString()
    @IsOptional()
    public email: string;

    @IsString()
    @IsOptional()
    public avatar: string;

    @IsString()
    @IsOptional()
    public phone: string;

    @IsString()
    @IsOptional()
    public state: string;

    @IsString()
    @IsOptional()
    public address: string;

    @IsInt()
    @IsOptional()
    public average_handicap: number;

}