/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { IsArray, IsInt } from 'class-validator';

export class UserScore {

    @IsInt()
    public user_id: number;

    @IsInt()
    public score: number;

}

export class CreateUpdateScore {

    @IsInt()
    public match_id: number;

    @IsInt()
    public hole_id: number;

    @IsArray()
    public userScore: UserScore[]

}