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
@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    TypeOrmModule.forFeature([UserModel, MatchModel, UserMatchPivotModel]),
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
  controllers: [AppController, AuthController, UserController, MatchController],
  providers: [AppService, UserService, AuthService, JwtStrategy, GoogleStrategy, MatchService],
})
export class AppModule {}
