import {Body, Controller, Post, Req, UploadedFile, UseGuards, UseInterceptors} from '@nestjs/common';
import {NewsService} from "./news.service";
import {ApiBody, ApiConsumes, ApiResponse, ApiTags} from "@nestjs/swagger";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {EventInterface} from "../event/event.interface";
import {FileInterceptor} from "@nestjs/platform-express";
import {multerOption} from "../file/file.service";

@ApiTags('news')
@Controller('news')
export class NewsController {
  constructor(
    private newsService: NewsService,
  ) {}

  @Post('/create')
  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({description: 'Upload news', type: EventInterface})
  @ApiResponse({ status: 200, description: 'Create new news'})
  @UseInterceptors(FileInterceptor('img', multerOption ))
  createEvent(@UploadedFile() file: Express.Multer.File, @Body() body, @Req() req) {
    let toBody = JSON.parse(JSON.stringify(body));
    console.log(file)
    console.log(toBody)
    console.log(req.user)
  }
}
