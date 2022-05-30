/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsDefined, IsInt } from 'class-validator';


export class MatchInviteDto {

    @IsInt()
    public match_id: number;

    @IsArray()
    public user_ids: Array<number>;

}