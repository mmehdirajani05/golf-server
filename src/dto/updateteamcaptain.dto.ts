/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { bool } from 'aws-sdk/clients/signer';
import { IsArray, IsBoolean, IsInt, IsNotEmpty } from 'class-validator';

export class updateTeamCaptinDto {

    @IsInt()
    public team_id: number;

    @IsInt()
    public captain_id: number;

}

export class markAsCompleteDto {

    @IsNotEmpty()
    @IsInt()
    public match_id: number;

    @IsNotEmpty()
    @IsBoolean()
    public is_complete: boolean;

}
