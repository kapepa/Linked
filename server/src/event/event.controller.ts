import {Body, Controller, Post, Req, UploadedFile, UseGuards, UseInterceptors} from '@nestjs/common';
import {ApiBody, ApiConsumes, ApiForbiddenResponse, ApiTags} from "@nestjs/swagger";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {FileInterceptor} from "@nestjs/platform-express";
import {multerOption} from "../file/file.service";
import {Observable, of} from "rxjs";
import {EventInterface} from "./event.interface";
import {EventDto} from "./event.dto";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {EventEntity} from "./event.entity";

@ApiTags('event')
@Controller('event')
export class EventController {

  constructor(
    @InjectRepository(EventEntity)
    private eventRepository: Repository<EventEntity>,
  ) {}

  @Post('/create')
  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({description: 'Create new event'})
  @ApiForbiddenResponse({ description: 'Forbidden.'})
  @UseInterceptors(FileInterceptor('img', multerOption ))
  createEvent(@UploadedFile() img: Express.Multer.File, @Req() req, @Body() body: EventDto): Observable<EventInterface> {
    return of({} as EventInterface);
  }
}
