/* eslint-disable prettier/prettier */
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { HolesModel } from 'src/models/holes.model';
import { MatchModel } from 'src/models/match.model';
import { ScoreboardModel } from 'src/models/scoreboard.model';
import { TeamModel } from 'src/models/team.model';
import { TeamPivotModel } from 'src/models/teampivot.model';
import { UserModel } from 'src/models/user.model';
import { UserMatchPivotModel } from 'src/models/usermatchpivot.model';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

class ConfigService {
  constructor(private env: { [k: string]: any | undefined }) {}

  private getValue(key: string, throwOnMissing = true): any {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  public ensureValues(keys: string[]) {
    keys.forEach((k) => this.getValue(k, true));
    return this;
  }

  public getPort() {
    return this.getValue('PORT', true);
  }

  public isProduction() {
    const mode = this.getValue('MODE', false);
    return mode != 'DEV';
  }

  public getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.getValue('POSTGRES_HOST'),
      port: parseInt(this.getValue('POSTGRES_PORT')),
      username: this.getValue('POSTGRES_USER'),
      password: this.getValue('POSTGRES_PASSWORD'),
      database: this.getValue('POSTGRES_DATABASE'),
      synchronize: this.getValue('SYNCHRONIZE'),
      // bucketName: this.getValue('AWS_S3_BUCKET_NAME'),
      // awsAccessKey: this.getValue('AWS_ACCESS_KEY_ID'),
      // awsSecretAccessKey: this.getValue('AWS_SECRET_ACCESS_KEY'),
      extra: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
      entities: [UserModel, MatchModel, UserMatchPivotModel, TeamModel, TeamPivotModel, HolesModel, ScoreboardModel],
    };
  }
}

const configService = new ConfigService(process.env).ensureValues([
  'POSTGRES_HOST',
  'POSTGRES_PORT',
  'POSTGRES_USER',
  'POSTGRES_PASSWORD',
  'POSTGRES_DATABASE',
  'SYNCHRONIZE',
  'POSTGRES_DATABASE_URL',
  // 'AWS_S3_BUCKET_NAME',
  // 'AWS_ACCESS_KEY_ID',
  // 'AWS_SECRET_ACCESS_KEY',
  // 'AWS_REGION',
]);

export { configService };
