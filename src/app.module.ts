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
import { CacheModule } from '@nestjs/common';
import { UserDetailsModel } from './models/user-details.model';
import { UserDetailsService } from './services/user-details/user-details.service';
import { UserDetailsController } from './controllers/user-details/user-details.controller';
import { NotificationService } from './services/notification/notification.service';
import { NotificationsModel } from './models/notifications.model';
import { HttpModule } from '@nestjs/axios';
@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    TypeOrmModule.forFeature([UserModel, MatchModel, UserMatchPivotModel, TeamModel, TeamPivotModel, HolesModel, ScoreboardModel, UserDetailsModel, NotificationsModel]),
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
    CacheModule.register(),
    HttpModule
  ],
  controllers: [AppController, AuthController, UserController, MatchController, ScoreController, UserDetailsController],
  providers: [AppService, UserService, AuthService, JwtStrategy, GoogleStrategy, MatchService, ScoreService, UserDetailsService, NotificationService],
})
export class AppModule {}
