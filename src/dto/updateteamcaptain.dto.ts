/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { IsArray, IsInt } from 'class-validator';

export class updateTeamCaptinDto {

    @IsInt()
    public team_id: number;

    @IsInt()
    public captain_id: number;

}