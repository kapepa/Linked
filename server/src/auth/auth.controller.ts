import {
  Body,
  Controller,
  HttpException, HttpStatus,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from "./auth.service";
import {FileInterceptor} from "@nestjs/platform-express";
import {Observable} from "rxjs";
import {UsersDto} from "../users/users.dto";
import {Roles} from "./roles.decorator";
import {Role} from "./role.enum";
import {LocalAuthGuard} from "./local-auth.guard";

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req) {
    return req.user;
  }

  @Post('registration')
  @UseInterceptors(FileInterceptor('file'))
  registration(@UploadedFile() file: Express.Multer.File, @Body() body: UsersDto): Observable<boolean> {
    try {
      let parse = JSON.parse(JSON.stringify(body))
      if (!!parse) throw new HttpException('There is no registration data in the following request', HttpStatus.BAD_REQUEST)
      return this.authService.registrationUser(parse);
    } catch (err) {
      return err
    }
  }

  @Put('/role')
  @Roles(Role.Admin)
  roleAdd(){

  }
}
