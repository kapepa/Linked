import { Module } from '@nestjs/common';
import { FeetController } from './feet.controller';
import { FeetService } from './feet.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Feet} from "./feet.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Feet])],
  controllers: [FeetController],
  providers: [FeetService],
})
export class FeetModule {}
