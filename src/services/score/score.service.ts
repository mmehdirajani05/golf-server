/* eslint-disable prefer-const */
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
  import { Brackets, Repository } from 'typeorm';
  import * as bcrypt from 'bcrypt';
  import { MessageText } from 'src/constants/messages';
import { MatchModel } from 'src/models/match.model';
import { UserMatchPivotModel } from 'src/models/usermatchpivot.model';
import { MatchInviteDto } from 'src/dto/matchinvite.dto';
import { CreateMatchDto } from 'src/dto/creatematch.dto';
import { UpdateUserInviteStatusDto } from 'src/dto/updateinvitestatus.dto';
import { HolesModel } from 'src/models/holes.model';
import { ScoreboardModel } from 'src/models/scoreboard.model';
import { TeamPivotModel } from 'src/models/teampivot.model';
import { max } from 'class-validator';
import { match } from 'assert';

  
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

      @InjectRepository(TeamPivotModel)
      private teamPivotRepository: Repository<TeamPivotModel>,

      private readonly jwtService: JwtService,
    ) {}
  
    async createUpdateScore(createUpdateScore) {
        if(createUpdateScore.userScore.length > 4 || createUpdateScore.userScore.length < 1) {
            return {
                error: "Minimum 1 and Maximum 4 user scores can be updated at a time!"
            }
        }
        try {
            for(let i = 0; i < createUpdateScore.userScore.length; i++) {
                let userScore = createUpdateScore.userScore[i]

                const getUserTeam = await this.teamPivotRepository.find({
                    where: {
                        user_id: userScore.user_id
                    }
                })
                // createUpdateScore = {...createUpdateScore, team_id: getUserTeam[0].team_id}
                const findScore = await this.scoreRepository.find({
                    where: {
                        match_id: createUpdateScore.match_id,
                        hole_id: createUpdateScore.hole_id,
                        user_id: userScore.user_id
                    }
                })
                if(findScore.length) {
                    await this.scoreRepository.update(findScore[0].id, {score: userScore.score})
                    // return {
                    //     response: "Score Updated!" 
                    // }
                } else {
                    const createScore = {
                        match_id: createUpdateScore.match_id,
                        hole_id: createUpdateScore.hole_id,
                        user_id: userScore.user_id,
                        score: userScore.score,
                        team_id: getUserTeam[0].team_id
                    }
                    const createScoreRecord = this.scoreRepository.create(createScore)
                    await this.scoreRepository.save(createScoreRecord)
                    // if(createScore) {
                    //     return {
                    //         response: "Created!"
                    //     }
                    // } else {
                    //     response: "Failed!"
                    // }
                }
            }
            return 1;
        } catch(err) {
            return err;
        }
    }

    async getMatchScores(matchScoreDto) {
        try{
            const scores = await this.scoreRepository.find({
                relations: ['user', 'hole'],
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

    async getSpecificHoleRecord(holeId, userId, matchId) {
        const getTeamId = await this.teamPivotRepository.find({
            where: {
                user_id: userId,
                match_id: matchId
            }
        })
        if(getTeamId.length) {
            const teamId = getTeamId[0].team_id
            const getAllTeamMembers = await this.teamPivotRepository.find({
                select: ['user_id'],
                where: {
                    team_id: teamId,
                    match_id: matchId
                }
            })
            const getAllTeamMembersIds = getAllTeamMembers.map((v) => {
                return +v.user_id
            })

            // Get Users Only
            const getTeamUsersRecord = await this.userRepository.createQueryBuilder('u')
                                                                .where("u.id IN (:...userId)", {userId: getAllTeamMembersIds})
                                                                .getMany();
            if(!getTeamUsersRecord.length) {
                return []
            }
            for(let i = 0; i < getTeamUsersRecord.length; i++) {
                const thisUser = getTeamUsersRecord[i];
                const getUserScores = await this.scoreRepository.find({
                    where: {
                        user_id: thisUser.id,
                        hole_id: holeId,
                        match_id: matchId
                    }
                })
                thisUser['score'] = getUserScores
            }
            return getTeamUsersRecord;
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

    async getWinner(matchId) {
        try {
            const getWinner = await this.userRepository.createQueryBuilder('u')
                                                    .leftJoinAndSelect('u.scoreBoard', 'score')
                                                    .select(["u", "score"])
                                                    // .addSelect("MAX(score.score)", "max")
                                                    .where("score.match_id = :matchId", { matchId: matchId})
                                                    .orderBy("score.score", 'DESC')
                                                    .limit(1)
                                                    .getMany();
            if(getWinner.length) {
                return getWinner;
            } else {
                return {
                    error: "Not found!"
                }
            }
        } catch(err) {
            return err;
        }
    }

    async getLeaderboard(userId, matchId) {
        const getUserTeam = await this.teamPivotRepository.find({
            where: {
                match_id: matchId,
                user_id: userId
            }
        })
        if(!getUserTeam.length) {
            throw new HttpException('User got no team!', HttpStatus.NOT_FOUND)
        }
        const getTeamMembers = await this.teamPivotRepository.find({
            select: ['user_id'],
            where: {
                team_id: getUserTeam[0].team_id,
                match_id: matchId
            }
        })
        const getAllTeamMembersIds = getTeamMembers.map((v) => {
            return +v.user_id
        })
        const getLeaderBoardScore = await this.userRepository.createQueryBuilder("u")
                                                .leftJoinAndSelect('u.scoreBoard', 'score')
                                                .where("score.user_id IN (:...userId)", {userId: getAllTeamMembersIds})
                                                .andWhere("score.match_id = :matchId", {matchId: matchId})
                                                .select("u.*")
                                                .addSelect("SUM(score.score)","score")
                                                .groupBy("u.id")
                                                .getRawMany();
        return getLeaderBoardScore;
    }
    
  }
    