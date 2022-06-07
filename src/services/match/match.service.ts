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
import { TeamModel } from 'src/models/team.model';
import { TeamPivotModel } from 'src/models/teampivot.model';

  
  @Injectable()
  export class MatchService {
    otpCode = '1234';
    constructor(
      @InjectRepository(MatchModel)
      private matchRepository: Repository<MatchModel>,

      @InjectRepository(UserMatchPivotModel)
      private userMatchPivotRepository: Repository<UserMatchPivotModel>,

      @InjectRepository(UserModel)
      private userRepository: Repository<UserModel>,

      @InjectRepository(HolesModel)
      private holesRepository: Repository<HolesModel>,

      @InjectRepository(TeamModel)
      private teamsRepository: Repository<TeamModel>,

      @InjectRepository(TeamPivotModel)
      private teamPivotRepository: Repository<TeamPivotModel>,

      private readonly jwtService: JwtService,
    ) {}
  
    async createMatch(match: CreateMatchDto) {
        try {
            const createMatch = this.matchRepository.create(match)
            await this.matchRepository.save(createMatch)
            if(createMatch) {
                return {
                    res: createMatch
                }
            } else {
                return {
                    res: 'Cannot create user'
                }
            }
        } catch(err) {
            return err
        }
    }

    async sendInvite(inviteDetails: MatchInviteDto) {
        try {
            const getInvitedUsers = await this.userMatchPivotRepository.find({
                where: {
                    match_id: inviteDetails.match_id
                }
            })
            if(getInvitedUsers.length < 16) {
                for(let i = 0; i < inviteDetails.user_ids.length; i++) {
                    const checkIfInviteSentAlready = await this.userMatchPivotRepository.find({
                        where: {
                            user_id: inviteDetails.user_ids[i],
                            match_id: inviteDetails.match_id
                        }
                    })
                    if(!checkIfInviteSentAlready.length){
                        const userInviteRecordJson = {
                            match_id: inviteDetails.match_id,
                            user_id: inviteDetails.user_ids[i]
                        }
                        const createInvitedUser = this.userMatchPivotRepository.create(userInviteRecordJson)
                        await this.userMatchPivotRepository.save(createInvitedUser)
                        if(createInvitedUser) {
                            // TODO: Send match invitation to users from here

                        }
                    }
                }
                return {
                    response: 'Success!'
                }
            }
            return {
                response: 'Failure!'
            }
        } catch(err) {
            return err
        }
    }

    async updateUserInviteStatus(updateUserStatus) {
        try {
            const findUser = await this.userMatchPivotRepository.find({
                where: {
                    match_id: updateUserStatus.match_id,
                    user_id: updateUserStatus.user_id
                }
            })
            if(findUser.length) {
                await this.userMatchPivotRepository.update(findUser[0].id, {
                    status: updateUserStatus.status
                })
            }
            // TODO: check if all users entered the match, if so, make teams here, else pass on.
            const findEnteredUser = await this.userMatchPivotRepository.find({
                where: {
                    match_id: updateUserStatus.match_id,
                    status: 'admitted'
                }
            })
            if(findEnteredUser.length == 16) {
                // Make teams
                for(let t = 1; t <= 4; t++) {
                    const team = {
                        match_id: updateUserStatus.match_id,
                        name: `Team ${t}`
                    }
                    const createTeam = this.teamsRepository.create(team)
                    await this.teamsRepository.save(createTeam)
                }
                try{
                    const allMatchTeams = await this.teamsRepository.find({
                        where: {
                            match_id: updateUserStatus.match_id
                        }
                    })
                    if(allMatchTeams.length == 4) {
                        // Get attendees in ASC order to create teams  
                        const getPlayers = await this.userRepository.createQueryBuilder('user')
                                                .leftJoinAndSelect('user.matchPivot', 'user_match_pivot')
                                                .select(['user', 'user_match_pivot'])
                                                .where("user_match_pivot.match_id = :id", {id: updateUserStatus.match_id})
                                                .orderBy('user_average_handicap', 'ASC')
                                                .getMany()
                        let teamId = 1;
                        for(let p=0; p < getPlayers.length; p++) {
                            const teamPlayer: any = {
                                user_id: getPlayers[p].id,
                                match_id: updateUserStatus.match_id,
                                team_id: allMatchTeams[teamId-1].id
                            }
                            const assignPlayerToTeam = this.teamPivotRepository.create(teamPlayer)
                            await this.teamPivotRepository.save(assignPlayerToTeam)
                            if(teamId % 4 == 0) {
                                teamId = 1
                            } else {
                                teamId++
                            }
                        }
                        return {
                            response: "Teams created successfully!"
                        }
                    } else {
                        return {
                            error: "Teams count didnt match expected number i.e. 4!"
                        }
                    }
                } catch(err) {
                    return err;
                }
            } else {
                return {
                    response: 'Insufficient users!'
                }
            }
        } catch (err) {
            return err
        }
    }

    async createHoles(createHoles) {
        try {
            for(let i = 0; i < createHoles.holes.length; i++) {
                const hole = createHoles.holes[i]
                const createHole = this.holesRepository.create(hole)
                await this.holesRepository.save(createHole)
            }
            return {
                response: "Holes created successfully!"
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

    async getMatchHoles(matchId) {
        try {
            const matchHoles = await this.holesRepository.find({
                where: {
                    match_id: matchId
                }
            })
            if(matchHoles.length) {
                return {
                    response: matchHoles
                }
            } else {
                return {
                    response: "Holes not found!"
                }
            }
        } catch(err) {
            return err;
        }
    }
    
  }
    