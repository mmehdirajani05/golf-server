/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsDate, IsDefined, IsInt, IsString } from 'class-validator';


export class UpdateUserInviteStatusDto {

    @IsInt()
    public match_id: number;

    @IsInt()
    public user_id: number;

    @IsString()
    public status: string;

}