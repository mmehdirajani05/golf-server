/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Controller, Get, UseGuards, Request, Param, Post, Body, Query } from '@nestjs/common';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { CreateHolesDto } from 'src/dto/createholes.dto';
import { CreateMatchDto } from 'src/dto/creatematch.dto';
import { MatchInviteDto } from 'src/dto/matchinvite.dto';
import { UpdateUserInviteStatusDto } from 'src/dto/updateinvitestatus.dto';
import { updateTeamCaptinDto, markAsCompleteDto } from 'src/dto/updateteamcaptain.dto';
import { JwtAuthGuard } from 'src/services/auth/jwt-auth.guard';
import { MatchService } from 'src/services/match/match.service';
import { UserService } from 'src/services/user/user.service';

@ApiTags('Match Settings')
@Controller('api/match')
export class MatchController {
  
  constructor(
    private matchService: MatchService,
    ) {}
    
    @UseGuards(JwtAuthGuard)
    @Post('create')
    createMatch(@Request() req, @Body() createMatch: CreateMatchDto) {
      return this.matchService.createMatch(req.user, createMatch)
    }
    
    @UseGuards(JwtAuthGuard)
    @Post('send-invite')
    async sendInvite(@Request() req, @Body() inviteDetails: MatchInviteDto) {
      return await this.matchService.sendInvite(req.user, inviteDetails)
    }

    @ApiProperty({description: 'Update user status and check if match users are completed, if so, organize teams'})
    @Post('update-user-invite-status')
    updateUserInviteStatus(@Body() updateStatus: UpdateUserInviteStatusDto) {
      return this.matchService.updateUserInviteStatus(updateStatus)
    }

    @UseGuards(JwtAuthGuard)
    @Post('create-holes')
    createHoles(@Body() createHoles: CreateHolesDto) {
      return this.matchService.createHoles(createHoles)
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    findAll() {
      return this.matchService.findAll()
    }

    @UseGuards(JwtAuthGuard)
    @Get('holes/:matchId')
    getMatchHoles(@Param('matchId') matchId: number) {
      return this.matchService.getMatchHoles(matchId)
    }

    @UseGuards(JwtAuthGuard)
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
    
    @UseGuards(JwtAuthGuard)
    @Get('get-match-teams-details/:matchId')
    getMatchTeamDetails(@Param('matchId') matchId: number) {
      return this.matchService.getMatchTeamDetails(matchId)
    }

    @UseGuards(JwtAuthGuard)
    @Get('get-match-teams/:matchId')
    getMatchTeams(@Param('matchId') matchId: number) {
      return this.matchService.getMatchTeams(matchId)
    }

    @UseGuards(JwtAuthGuard)
    @Post('update-captain')
    async updateTeamCaptain(@Body() updateTeamCaptinDto: updateTeamCaptinDto) {
      return await this.matchService.updateTeamCaptain(updateTeamCaptinDto)
    }

    @UseGuards(JwtAuthGuard)
    @Post('mark-as-complete')
    markAsComplete(@Body() markAsCompleteDto: markAsCompleteDto) {
      return this.matchService.markAsComplete(markAsCompleteDto)
    }
}
