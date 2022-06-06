/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { IsInt } from 'class-validator';


export class CreateUpdateScore {

    @IsInt()
    public match_id: number;

    @IsInt()
    public user_id: number;

    @IsInt()
    public hole_id: number;

    @IsInt()
    public score: number;

}