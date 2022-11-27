import {
  Body,
  Controller, Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import {ApiBody, ApiConsumes, ApiForbiddenResponse, ApiResponse, ApiTags} from "@nestjs/swagger";
import {FileInterceptor} from "@nestjs/platform-express";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {multerOption} from "../file/file.service";
import {UsersService} from "./users.service";
import {Observable} from "rxjs";
import {UsersInterface} from "./users.interface";
import {DeleteResult, UpdateResult} from "typeorm";

@ApiTags('users')
@Controller('users')
export class UsersController {

  constructor(
    private usersService: UsersService
  ) {}

  @Post('avatar')
  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({description: 'Upload user avatar',})
  @ApiForbiddenResponse({ description: 'Forbidden.'})
  @UseInterceptors(FileInterceptor('file', multerOption ))
  avatarLoad(@UploadedFile() file: Express.Multer.File, @Req() req): Observable<{access_token: string}> {
    return this.usersService.avatarUser(file, req.user);
  }

  @Get('')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'Get own profile'})
  @ApiForbiddenResponse({ status: HttpStatus.BAD_REQUEST, description: 'Something went wrong with get profile'})
  getUser(@Req() req): Observable<UsersInterface> {
    return this.usersService.findOne('id', req.user.id, { relations: ['suggest', 'suggest.user'] });
  }

  @Get('person/:id')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'Find user on id, receive his data and friends'})
  @ApiForbiddenResponse({ status: HttpStatus.BAD_REQUEST, description: 'Something went wrong with friend'})
  person(@Param('id') id, @Req() req): Observable<any> {
    return this.usersService.person(id, req.user);
  }

  @Patch('update')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'Update own data'})
  @ApiForbiddenResponse({ status: HttpStatus.BAD_REQUEST, description: 'Something went wrong when update'})
  update(@Body() body, @Req() req): Observable<UpdateResult>{
    return this.usersService.updateUser('id', req.user.id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'delete user on id'})
  @ApiForbiddenResponse({ status: HttpStatus.BAD_REQUEST, description: 'Something went wrong when delete'})
  del(@Param('id') userID): Observable<DeleteResult> {
    return this.usersService.del(userID);
  }
}
