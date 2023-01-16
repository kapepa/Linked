import {Controller, Post, Req, UploadedFile, UseGuards, UseInterceptors} from '@nestjs/common';
import {ApiBody, ApiConsumes, ApiForbiddenResponse, ApiTags} from "@nestjs/swagger";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {FileInterceptor} from "@nestjs/platform-express";
import {multerOption} from "../file/file.service";
import {Observable, of} from "rxjs";

@ApiTags('event')
@Controller('event')
export class EventController {

  @Post('/create')
  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({description: 'Create new event'})
  @ApiForbiddenResponse({ description: 'Forbidden.'})
  @UseInterceptors(FileInterceptor('img', multerOption ))
  createEvent(@UploadedFile() img: Express.Multer.File, @Req() req): Observable<any> {
    return of({});
  }
}
