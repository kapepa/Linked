import { Module } from '@nestjs/common';
import { FeetController } from './feet.controller';
import { FeetService } from './feet.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Feet } from "./feet.entity";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [
    TypeOrmModule.forFeature([Feet]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
  ],
  controllers: [FeetController],
  providers: [FeetService],
})
export class FeetModule {}
