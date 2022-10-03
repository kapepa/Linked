import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from "../users/users.module";
import { LocalStrategy } from "./local.strategy";
import { PassportModule } from '@nestjs/passport';

@Module({
  controllers: [AuthController],
  imports: [
    UsersModule,
    PassportModule,
  ],
  providers: [
    AuthService,
    LocalStrategy,
  ]
})
export class AuthModule {}
