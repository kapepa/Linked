import {forwardRef, Module} from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from "../users/users.module";
import { LocalStrategy } from "./local.strategy";
import { PassportModule } from '@nestjs/passport';
import {JwtModule, JwtService} from "@nestjs/jwt";
import { config } from "dotenv";
import { JwtStrategy } from "./jwt.strategy";
import { APP_GUARD } from "@nestjs/core";
import { RolesGuard } from "./roles.guard";
import { MailService } from "../mailer/mailer.service";
import { GoogleStrategy } from "./google.strategy";

config()

@Module({
  controllers: [AuthController],
  imports: [
    forwardRef(() => UsersModule),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '30d' },
    }),
  ],
  exports: [
    AuthService,
  ],
  providers: [
    AuthService,
    MailService,
    LocalStrategy,
    JwtStrategy,
    GoogleStrategy,
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AuthModule {}
