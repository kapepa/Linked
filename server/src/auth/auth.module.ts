import {forwardRef, Module} from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from "../users/users.module";
import { LocalStrategy } from "./local.strategy";
import { PassportModule } from '@nestjs/passport';
import {JwtModule, JwtService} from "@nestjs/jwt";
import { JwtStrategy } from "./jwt.strategy";
import { APP_GUARD } from "@nestjs/core";
import { RolesGuard } from "./roles.guard";
import { MailService } from "../mailer/mailer.service";
import { GoogleStrategy } from "./google.strategy";
import { FacebookStrategy } from "./facebook.strategy";
import { config } from "dotenv";
import {ChatService} from "../chat/chat.service";
import {ChatModule} from "../chat/chat.module";

config();

@Module({
  controllers: [AuthController],
  imports: [
    forwardRef(() => UsersModule),
    forwardRef(() => ChatModule),
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
    JwtStrategy,
    LocalStrategy,
    GoogleStrategy,
    FacebookStrategy,
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AuthModule {}
