import {
  Body,
  Controller, Get,
  HttpException, HttpStatus,
  Post,
  Put,
  Req, Res,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { AuthService } from "./auth.service";
import {AnyFilesInterceptor, FileInterceptor} from "@nestjs/platform-express";
import {Observable, of, throwError} from "rxjs";
import {UsersDto} from "../users/users.dto";
import {Roles} from "./roles.decorator";
import {Role} from "./role.enum";
import {LocalAuthGuard} from "./local-auth.guard";
import {ApiCreatedResponse, ApiForbiddenResponse, ApiTags} from "@nestjs/swagger";
import {GoogleOAuthGuard} from "./google-oauth.guard";

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService
  ) {}

  @Post('login')
  @UseInterceptors(AnyFilesInterceptor())
  @UseGuards(LocalAuthGuard)
  @ApiCreatedResponse({ status: 201, description: 'The user has been successfully login.'})
  @ApiForbiddenResponse({ status: 401, description: 'Unauthorized.'})
  login(@Req() req): Observable<{access_token: string}> {
    return this.authService.loginUser(req.user);
  }

  @Post('registration')
  @UseInterceptors(FileInterceptor('file'))
  @ApiCreatedResponse({ status: 200, description: 'The user has been successfully registration.'})
  @ApiForbiddenResponse({ status: 400, description: 'Bad Request.'})
  @ApiForbiddenResponse({ status: 409, description: 'This email already exists.'})
  registration(@UploadedFile() file: Express.Multer.File, @Body() body: UsersDto): Observable<boolean> {
    let parse = JSON.parse(JSON.stringify(body));
    if (!Object.keys(parse).length) return throwError(() => new HttpException('There is no registration data in the following request.', HttpStatus.BAD_REQUEST));
    return this.authService.registrationUser(parse);
  }

  @Put('role')
  @Roles(Role.Admin)
  roleAdd(){
    return JSON.stringify(true)
  }

  @Get('/google')
  @UseGuards(GoogleOAuthGuard)
  AuthGoogle(@Req() req) {
    return req.user
  }

  @Get('/google-redirect')
  @UseGuards(GoogleOAuthGuard)
  RedirectGoogle(@Req() req, @Res() res) {
    res.header('Content-type', 'text/html');
    res.end(`<script>window.opener.postMessage(${JSON.stringify(req.user)}, "*"); window.close();</script>`);
  }
}
