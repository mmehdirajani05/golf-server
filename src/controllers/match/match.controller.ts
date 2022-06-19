/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Controller, Get, UseGuards, Request, Param, Post, Body, Query } from '@nestjs/common';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { CreateHolesDto } from 'src/dto/createholes.dto';
import { CreateMatchDto } from 'src/dto/creatematch.dto';
import { MatchInviteDto } from 'src/dto/matchinvite.dto';
import { UpdateUserInviteStatusDto } from 'src/dto/updateinvitestatus.dto';
import { updateTeamCaptinDto } from 'src/dto/updateteamcaptain.dto';
import { JwtAuthGuard } from 'src/services/auth/jwt-auth.guard';
import { MatchService } from 'src/services/match/match.service';
import { UserService } from 'src/services/user/user.service';

@ApiTags('Match Settings')
@Controller('api/match')
export class MatchController {
  
  constructor(
    private matchService: MatchService,
    ) {}
    
//   @UseGuards(JwtAuthGuard)
    @Post('create')
    createMatch(@Body() createMatch: CreateMatchDto) {
      return this.matchService.createMatch(createMatch)
    }
    
    @Post('send-invite')
    sendInvite(@Body() inviteDetails: MatchInviteDto) {
      return this.matchService.sendInvite(inviteDetails)
    }

    @ApiProperty({description: 'Update user status and check if match users are completed, if so, organize teams'})
    @Post('update-user-invite-status')
    updateUserInviteStatus(@Body() updateStatus: UpdateUserInviteStatusDto) {
      return this.matchService.updateUserInviteStatus(updateStatus)
    }

    @Post('create-holes')
    createHoles(@Body() createHoles: CreateHolesDto) {
      return this.matchService.createHoles(createHoles)
    }

    @Get()
    findAll() {
      return this.matchService.findAll()
    }

    @Get('holes/:matchId')
    getMatchHoles(@Param('matchId') matchId: number) {
      return this.matchService.getMatchHoles(matchId)
    }

    @Get('specific-hole/:holeId')
    getSpecificHole(@Param('holeId') holeId: number) {
      return this.matchService.getSpecificHole(holeId)
    }

    @UseGuards(JwtAuthGuard)
    @Get('/search')
    async searchUserMatch(
      @Request() req,
      @Query('search_str') searchStr: string,
    ) {
      return  await this.matchService.searchUserMatch(searchStr, req.user)
    }
    
    @Get('get-match-teams-details/:matchId')
    getMatchTeamDetails(@Param('matchId') matchId: number) {
      return this.matchService.getMatchTeamDetails(matchId)
    }

    @Get('get-match-teams/:matchId')
    getMatchTeams(@Param('matchId') matchId: number) {
      return this.matchService.getMatchTeams(matchId)
    }

    @Post('update-captain')
    updateTeamCaptain(@Body() updateTeamCaptinDto: updateTeamCaptinDto) {
      return this.matchService.updateTeamCaptain(updateTeamCaptinDto)
    }
}
