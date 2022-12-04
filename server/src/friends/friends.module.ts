import { Module } from '@nestjs/common';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { FriendsEntity} from "./friends.entity";
import { UsersModule } from "../users/users.module";
import { ChatModule } from "../chat/chat.module";
import { FriendsGateway } from "./friends.gateway";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [
    ChatModule,
    UsersModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '30d' },
    }),
    TypeOrmModule.forFeature([ FriendsEntity ]),
  ],
  exports: [FriendsService],
  providers: [FriendsGateway, FriendsService],
  controllers: [FriendsController],
})
export class FriendsModule {}
