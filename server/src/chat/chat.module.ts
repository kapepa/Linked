import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { JwtModule } from "@nestjs/jwt";
import { UsersModule } from "../users/users.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MessageEntity } from "./message.entity";
import { Chat } from "./chat.entity";

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([Chat, MessageEntity]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '30d' },
    }),
  ],
  exports: [ChatService],
  providers: [ChatGateway, ChatService],
  controllers: [ChatController],
})
export class ChatModule {}
