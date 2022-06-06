/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { IsInt } from 'class-validator';


export class MatchScoreDto {

    @IsInt()
    public match_id: number;

}