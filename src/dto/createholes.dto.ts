/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsDate, IsDefined, IsInt, IsString } from 'class-validator';


export class CreateHolesDto {

    @IsInt()
    public match_id: number;

    @IsInt()
    public yards: number;

    @IsInt()
    public par_allowed: number;

}