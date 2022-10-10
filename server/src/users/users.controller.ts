import {Controller, Post, Req, UploadedFile, UseGuards, UseInterceptors} from '@nestjs/common';
import {ApiBody, ApiConsumes, ApiForbiddenResponse, ApiTags} from "@nestjs/swagger";
import {FileInterceptor} from "@nestjs/platform-express";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {FileService, multerOption} from "../file/file.service";
import {Request} from "express";
import {UsersService} from "./users.service";
import {Observable} from "rxjs";

@ApiTags('users')
@Controller('users')
export class UsersController {

  constructor(
    private usersService: UsersService
  ) {}

  @Post('avatar')
  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload user avatar',
    // type: FileUploadDto,
  })
  @ApiForbiddenResponse({ description: 'Forbidden.'})
  @UseInterceptors(FileInterceptor('file', multerOption ))
  avatarLoad(@UploadedFile() file: Express.Multer.File, @Req() req): Observable<{access_token: string}> {
    return this.usersService.avatarUser(file, req.user);
  }
}
