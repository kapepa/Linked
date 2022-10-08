import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./users.entity";
import { FileModule } from "../file/file.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    FileModule,
  ],
  controllers: [UsersController],
  exports: [UsersService],
  providers: [UsersService],
})
export class UsersModule {}
