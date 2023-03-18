import {Body, Controller, Get, Param, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors} from '@nestjs/common';
import {ApiBody, ApiConsumes, ApiForbiddenResponse, ApiTags} from "@nestjs/swagger";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {FileInterceptor} from "@nestjs/platform-express";
import {multerOption} from "../file/file.service";
import {Observable, of} from "rxjs";
import {EventInterface} from "./event.interface";
import {EventDto} from "./event.dto";
import {EventService} from "./event.service";

@ApiTags('event')
@Controller('event')
export class EventController {
  constructor(
    private eventService: EventService,
  ) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({description: 'Create new event'})
  @ApiForbiddenResponse({ description: 'Forbidden.'})
  @UseInterceptors(FileInterceptor('img', multerOption ))
  createEvent(@UploadedFile() img: Express.Multer.File, @Req() req, @Body() body: EventDto): Observable<EventDto | EventInterface> {
    let toEvent = JSON.parse(JSON.stringify(body));
    return this.eventService.createEvent({...toEvent, img: img?.filename, user: req.user});
  };

  @Get('one/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBody({description: 'get one event on id', type: EventInterface})
  @ApiForbiddenResponse({ description: 'Forbidden.'})
  oneEvent(@Param() param, @Req() req):  Observable<EventInterface> {
    return this.eventService.findOneEvent({ where: { id: param.id }})
  }

  @Get('list')
  @UseGuards(JwtAuthGuard)
  @ApiBody({description: 'get list event on query', type: EventInterface})
  @ApiForbiddenResponse({ description: 'Forbidden.'})
  listEvent(@Query() query): Observable<EventInterface[]> {
    let { take, skip } = query;
    return this.eventService.findEvents({...query, skip: Number(skip), take: Number(take)});
  };
}
