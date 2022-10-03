import {Body, Controller, Post, Put, Req, UploadedFile, UseGuards, UseInterceptors} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from "./auth.service";
import {FileInterceptor} from "@nestjs/platform-express";
import {Observable} from "rxjs";
import {UsersDto} from "../users/users.dto";
import {Roles} from "./roles.decorator";
import {Role} from "./role.enum";

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService
  ) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Req() req) {
    return req.user;
  }

  @Post('registration')
  @UseInterceptors(FileInterceptor('file'))
  registration(@UploadedFile() file: Express.Multer.File, @Body() body: UsersDto): Observable<any> {
    return this.authService.registrationUser(JSON.parse(JSON.stringify(body)));
  }

  @Put('/role')
  @Roles(Role.Admin)
  roleAdd(){

  }
}
