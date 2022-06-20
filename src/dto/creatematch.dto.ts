/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { IsDate, IsInt, IsNotEmpty, IsString } from 'class-validator';
export class CreateMatchDto {

    @IsNotEmpty()
    @IsString()
    public title: string;

    @IsNotEmpty()
    @IsDate()
    public datetime: Date;

    @IsNotEmpty()
    @IsString()
    public location: string;

    @IsNotEmpty()
    @IsInt()
    public created_by: number;

    @IsNotEmpty()
    @IsInt()
    public matchfees: number;

}