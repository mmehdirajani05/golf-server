/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Controller, Get, UseGuards, Request, Param, Post, Body } from '@nestjs/common';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { CreateUpdateScore } from 'src/dto/createupdatescore.dto';
import { MatchScoreDto } from 'src/dto/matchscore.dto';
import { ScoreService } from 'src/services/score/score.service';

@ApiTags('Score Management')
@Controller('api/score')
export class ScoreController {
  
  constructor(
    private scoreService: ScoreService,
    ) {}
    
//   @UseGuards(JwtAuthGuard)
    @Post('create')
    @ApiProperty({description: "Getting request details in order to create if not exist score or update if exist"})
    createUpdateScore(@Body() createUpdateScore: CreateUpdateScore) {
      return this.scoreService.createUpdateScore(createUpdateScore)
    }

    @Post('get-match-scores')
    @ApiProperty({description: "Getting match scores for each player with respect to each hole"})
    getMatchScores(@Body() matchScoreDto: MatchScoreDto) {
      return this.scoreService.getMatchScores(matchScoreDto)
    }

    @Get('get-specific-hole-record/:holeId/:userId/:matchId')
    getSpecificHoleRecord(@Param('holeId') holeId: number, @Param('userId') userId: number, @Param('matchId') matchId: number) {
      return this.scoreService.getSpecificHoleRecord(holeId, userId, matchId)
    }
}
