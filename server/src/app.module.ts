import * as dotenv from 'dotenv';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FeetModule } from './feet/feet.module';
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Feet } from "./feet/feet.entity";
import { User } from "./users/users.entity";
import { FriendsEntity } from "./friends/friends.entity";
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from "@nestjs/jwt";
import { FileModule } from './file/file.module';
import { ServeStaticModule } from "@nestjs/serve-static";
import { FriendsModule } from './friends/friends.module';
import { join } from 'path';
import { ChatModule } from "./chat/chat.module";
import { Chat } from "./chat/chat.entity";
import { MessageEntity } from "./chat/message.entity";
import { AppGateway } from "./app.gateway.spec";
import { CommentEntity } from "./feet/comment.entity";
import { AdditionEntity } from "./feet/addition.entity";
import { EventModule } from './event/event.module';

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
      entities: [ User, Feet, FriendsEntity, Chat, MessageEntity, CommentEntity, AdditionEntity ],
      synchronize: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '/static'),
    }),
    FeetModule,
    UsersModule,
    AuthModule,
    JwtModule,
    FileModule,
    FriendsModule,
    ConfigModule,
    ChatModule,
    EventModule,
  ],
  controllers: [AppController],
  providers: [AppGateway, AppService],
})
export class AppModule {}
