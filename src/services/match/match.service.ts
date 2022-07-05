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
import { MatchModel, MatchStatus } from 'src/models/match.model';
import { UserMatchPivotModel } from 'src/models/usermatchpivot.model';
import { MatchInviteDto } from 'src/dto/matchinvite.dto';
import { CreateMatchDto } from 'src/dto/creatematch.dto';
import { UpdateUserInviteStatusDto } from 'src/dto/updateinvitestatus.dto';
import { HolesModel } from 'src/models/holes.model';
import { TeamModel } from 'src/models/team.model';
import { TeamPivotModel } from 'src/models/teampivot.model';
import { MessageText } from 'src/constants/messages';
import { NotificationsModel } from 'src/models/notifications.model';
import { UserDetailsModel } from 'src/models/user-details.model';
import { NotificationService } from '../notification/notification.service';

  
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

      @InjectRepository(NotificationsModel)
      private notificationRepository: Repository<NotificationsModel>,

      @InjectRepository(UserDetailsModel)
      private userDetailsRepository: Repository<UserDetailsModel>,

      private readonly jwtService: JwtService,
      private notificationsService: NotificationService,
    ) {}
  
    async createMatch(userId, match: CreateMatchDto) {
        match.title = match.title.toLowerCase()
        try {
            const createMatch = this.matchRepository.create(match)
            await this.matchRepository.save(createMatch)
            await this.sendInvite(userId, {match_id: +createMatch.id, user_ids: [createMatch.createdby]}) // mkae owner part of match
            
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

    async sendInvite(userId: number, inviteDetails: MatchInviteDto) {
        try {
            const getInvitedUsers = await this.userMatchPivotRepository.find({
                where: {
                    match_id: inviteDetails.match_id
                }
            })
            if(getInvitedUsers.length < 16) {
                let createNotificationsRecord = [];
                let FCMTokens = [];
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
                        
                        // Admitting user hardcode to match
                        const admitUserToMatch = {
                            match_id: inviteDetails.match_id,
                            user_id: inviteDetails.user_ids[i],
                            status: 'admitted'
                        }
                        this.updateUserInviteStatus(admitUserToMatch)
                        // Admitting user hardcode to match ends here

                        // Save notfications starts here
                        let notificationObj = {
                            match_id: inviteDetails.match_id,
                            sender_id: userId,
                            recipient_id: inviteDetails.user_ids[i],
                            message: MessageText.matchInvite
                        }
                        createNotificationsRecord.push(this.notificationRepository.create(notificationObj))
                        // Save notfications ends here

                        // Get FCM tokens from user details here
                        let getTokens = await this.userDetailsRepository.find({
                            user_id: inviteDetails.user_ids[i]
                        })
                        if(getTokens.length) {
                            FCMTokens.push(getTokens[0].fcm_id)
                        }
                        // Get FCM tokens from user details ends here
                    }
                }
                // Save notifications records those are created and saved in createNotificationsRecord array
                await this.notificationRepository.save(createNotificationsRecord);

                // Send notifications
                if(FCMTokens.length) {
                    console.log(FCMTokens)
                    await this.notificationsService.sendMatchInviteNotification(FCMTokens)
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

    async getSpecificHole(holeId) {
        try {
            const matchHole = await this.holesRepository.findOne(holeId)
            if(matchHole) {
                return {
                    response: matchHole
                }
            } else {
                return {
                    error: "No hole found!"
                }
            }
        } catch(err) {
            return err;
        }
    }

    async searchUserMatch(searchStr: string, userId: number) {
        
        const currDateTime = (new Date()).toISOString().split("T")
        let alterdDateTime = currDateTime.join(" ")
        // return alterdDateTime;
        try {
            let prev_matches_query = this.matchRepository.createQueryBuilder('match')
                .leftJoinAndSelect('match.matchPivot', 'user_match_pivot')
                .select(['match'])
                .where("user_match_pivot.user_id = :id", {id: userId})
                .andWhere(new Brackets(qb => {
                    qb.where("match.datetime < :alterdDateTime", {alterdDateTime})
                        .orWhere("match.status = :status", {status: MatchStatus.COMPLETE})
                  }))
                
        
            let upcoming_matches_query = this.matchRepository.createQueryBuilder('match')
                .leftJoinAndSelect('match.matchPivot', 'user_match_pivot')
                .select(['match'])
                .where("user_match_pivot.user_id = :id", {id: userId})
                .andWhere("match.datetime > :alterdDateTime", {alterdDateTime})
                .andWhere("match.status = :status", {status: MatchStatus.PENDING})

            if (searchStr !== "") {
                prev_matches_query.andWhere("match.title LIKE :title", {title: `%${searchStr}%`})
                upcoming_matches_query.andWhere("match.title LIKE :title", {title: `%${searchStr}%`})
            }


            const complete_matches = await prev_matches_query.getMany()
            const upcoming_matches = await upcoming_matches_query.getMany()

            return {complete_matches, upcoming_matches}
        } catch{
            throw new HttpException(
                MessageText.serverError,
                HttpStatus.INTERNAL_SERVER_ERROR,
              );
        }
    }

        
    async getMatchTeamDetails(matchId) {
        const teamDetails = await this.teamsRepository.find({
            where: {
                match_id: matchId
            }
        })
        if(!teamDetails.length) {
            throw new HttpException('No teams found for this match!', HttpStatus.NOT_FOUND)
        }
        return teamDetails;
    }

    async getMatchTeams(matchId) {
        const getTeams = await this.userRepository.createQueryBuilder('user')
                                                .leftJoinAndSelect('user.teams', 'team')
                                                .select(['user', 'team.team_id'])
                                                .where("team.match_id = :matchId", {matchId: matchId})
                                                .getMany()
        if(!getTeams.length) {
            return []
        }
        return getTeams;
    }

    async updateTeamCaptain(updateTeamCaptinDto) {
        await this.teamsRepository.update(updateTeamCaptinDto.team_id, {
            captain: updateTeamCaptinDto.captain_id
        })

        return {
            response: MessageText.success
        }
    }

    async markAsComplete(markAsCompleteDTO) {
        await this.matchRepository.update(markAsCompleteDTO.match_id, {
            status: markAsCompleteDTO.is_complete ? MatchStatus.COMPLETE : MatchStatus.PENDING
        })

        return {
            response: MessageText.success
        }
    }
    
  }
    