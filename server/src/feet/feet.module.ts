import { Module } from '@nestjs/common';
import { FeetController } from './feet.controller';
import { FeetService } from './feet.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Feet } from "./feet.entity";
import { JwtModule } from "@nestjs/jwt";
import { CommentEntity } from "./comment.entity";
import { FileModule } from "../file/file.module";
import { AdditionEntity } from "./addition.entity";

@Module({
  imports: [
    FileModule,
    TypeOrmModule.forFeature([Feet, CommentEntity, AdditionEntity]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
  ],
  providers: [FeetService],
  controllers: [FeetController],
})
export class FeetModule {}
