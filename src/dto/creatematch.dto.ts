/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsDate, IsDefined, IsInt, IsString } from 'class-validator';


export class CreateMatchDto {

    @IsString()
    public title: string;

    @IsDate()
    public datetime: Date;

    @IsString()
    public location: string;

    @IsInt()
    public created_by: number;

    @IsInt()
    public matchfees: number;

}