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
import { AppGateway } from "./app.gateway";
import { CommentEntity } from "./feet/comment.entity";
import { AdditionEntity } from "./feet/addition.entity";
import { EventModule } from './event/event.module';
import { EventEntity } from "./event/event.entity";
import { NewsModule } from './news/news.module';
import { NewsEntity } from "./news/news.entity";
import { MailModule } from './mailer/mailer.module';

dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [ User, Feet, FriendsEntity, Chat, MessageEntity, CommentEntity, AdditionEntity, EventEntity, NewsEntity ],
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
    NewsModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [
    AppGateway,
    AppService,
  ],
})
export class AppModule {}
