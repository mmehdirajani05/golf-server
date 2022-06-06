/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import {
    HttpException,
    HttpStatus,
    Injectable,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import { InjectRepository } from '@nestjs/typeorm';
  import { UserModel } from 'src/models/user.model';
  import { Repository } from 'typeorm';
  import * as bcrypt from 'bcrypt';
  import { MessageText } from 'src/constants/messages';
import { MatchModel } from 'src/models/match.model';
import { UserMatchPivotModel } from 'src/models/usermatchpivot.model';
import { MatchInviteDto } from 'src/dto/matchinvite.dto';
import { CreateMatchDto } from 'src/dto/creatematch.dto';
import { UpdateUserInviteStatusDto } from 'src/dto/updateinvitestatus.dto';
import { HolesModel } from 'src/models/holes.model';
import { ScoreboardModel } from 'src/models/scoreboard.model';

  
  @Injectable()
  export class ScoreService {
    constructor(
      @InjectRepository(MatchModel)
      private matchRepository: Repository<MatchModel>,

      @InjectRepository(UserMatchPivotModel)
      private userMatchPivotRepository: Repository<UserMatchPivotModel>,

      @InjectRepository(UserModel)
      private userRepository: Repository<UserModel>,

      @InjectRepository(HolesModel)
      private holesRepository: Repository<HolesModel>,

      @InjectRepository(ScoreboardModel)
      private scoreRepository: Repository<ScoreboardModel>,

      private readonly jwtService: JwtService,
    ) {}
  
    async createUpdateScore(createUpdateScore) {
        try {
            const findScore = await this.scoreRepository.find({
                where: {
                    match_id: createUpdateScore.match_id,
                    hole_id: createUpdateScore.hole_id,
                    user_id: createUpdateScore.user_id
                }
            })
            if(findScore.length) {
                await this.scoreRepository.update(findScore[0].id, {score: createUpdateScore.score})
                return {
                    response: "Score Updated!" 
                }
            } else {
                const createScore = this.scoreRepository.create(createUpdateScore)
                await this.scoreRepository.save(createScore)
                if(createScore) {
                    return {
                        response: "Created!"
                    }
                } else {
                    response: "Failed!"
                }
            }
        } catch(err) {
            return err;
        }
    }

    async getMatchScores(matchScoreDto) {
        try{
            const scores = await this.scoreRepository.find({
                where: {
                    match_id: matchScoreDto.match_id
                }
            })
            if(scores.length) {
                return {
                    response: scores
                }
            } else {
                return {
                    error: "No scores found"
                }
            }
        } catch(err) {
            return err;
        }
    }

    async findAll() {
        try {
            const matches = await this.matchRepository.find()
            if(matches.length) {
                return matches
            } else {
                return {
                    error: 'No matches found'
                }
            }
        } catch(err) {
            return err
        }
    }
    
  }
    