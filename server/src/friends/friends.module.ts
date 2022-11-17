import { Module } from '@nestjs/common';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { FriendsEntity} from "./friends.entity";
import { UsersModule } from "../users/users.module";
import { ChatModule } from "../chat/chat.module";

@Module({
  imports: [
    ChatModule,
    UsersModule,
    TypeOrmModule.forFeature([ FriendsEntity ]),
  ],
  controllers: [FriendsController],
  providers: [FriendsService]
})
export class FriendsModule {}
