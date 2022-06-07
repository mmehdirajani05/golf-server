/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsDate, IsDefined, IsInt, IsString } from 'class-validator';


export class CreateHolesDto {
    @IsArray()
    public holes: Array<HolesParams>
}
export class HolesParams {

    @IsInt()
    public match_id: number;

    @IsInt()
    public yards: number;

    @IsInt()
    public par_allowed: number;

    @IsInt()
    public match_specific_id: number;

}