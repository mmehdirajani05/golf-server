/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './controllers/auth/auth.controller';
import { UserController } from './controllers/user/user.controller';
import { UserModel } from './models/user.model';
import { AuthService } from './services/auth/auth.service';
import { JwtStrategy } from './services/auth/jwt.strategy';
import { configService } from './services/config/config.service';
import { UserService } from './services/user/user.service';
import { GoogleStrategy } from './google.strategy'
import { MatchModel } from './models/match.model';
import { MatchService } from './services/match/match.service';
import { MatchController } from './controllers/match/match.controller';
import { UserMatchPivotModel } from './models/usermatchpivot.model';
import { TeamModel } from './models/team.model';
import { TeamPivotModel } from './models/teampivot.model';
import { HolesModel } from './models/holes.model';
import { ScoreboardModel } from './models/scoreboard.model';
import { ScoreController } from './controllers/score/score.controller';
import { ScoreService } from './services/score/score.service';
@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    TypeOrmModule.forFeature([UserModel, MatchModel, UserMatchPivotModel, TeamModel, TeamPivotModel, HolesModel, ScoreboardModel]),
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
      session: false,
    }),
    JwtModule.register({
      secret: process.env.SECRETKEY,
      signOptions: {
        expiresIn: process.env.EXPIRESIN,
      },
    }),
  ],
  controllers: [AppController, AuthController, UserController, MatchController, ScoreController],
  providers: [AppService, UserService, AuthService, JwtStrategy, GoogleStrategy, MatchService, ScoreService],
})
export class AppModule {}
