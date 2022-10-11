import { Module } from '@nestjs/common';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { FriendsEntity} from "./friends.entity";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([ FriendsEntity ]),
    UsersModule,
  ],
  controllers: [FriendsController],
  providers: [FriendsService]
})
export class FriendsModule {}
