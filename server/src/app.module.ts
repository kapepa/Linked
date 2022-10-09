import * as dotenv from 'dotenv';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FeetModule } from './feet/feet.module';
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Feet } from "./feet/feet.entity";
import { User } from "./users/users.entity";
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import {JwtModule} from "@nestjs/jwt";
import { FileModule } from './file/file.module';
import {ServeStaticModule} from "@nestjs/serve-static";
import { join } from 'path';

dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User,Feet],
      synchronize: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '/static'),
    }),
    FeetModule,
    UsersModule,
    AuthModule,
    JwtModule,
    FileModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
