import {Body, Controller, Get, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors} from '@nestjs/common';
import {NewsService} from "./news.service";
import {ApiBody, ApiConsumes, ApiResponse, ApiTags} from "@nestjs/swagger";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {FileInterceptor} from "@nestjs/platform-express";
import {multerOption} from "../file/file.service";
import {Observable, of} from "rxjs";
import {NewsInterface} from "./news.interface";
import {NewsDto} from "./news.dto";

@ApiTags('news')
@Controller('news')
export class NewsController {

  constructor(
    private newsService: NewsService,
  ) {}

  @Post('/create')
  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({description: 'Upload news'})
  @ApiResponse({ status: 200, description: 'Create new news'})
  @UseInterceptors(FileInterceptor('img', multerOption ))
  createNews(@UploadedFile() file: Express.Multer.File, @Body() body, @Req() req): Observable<NewsDto | NewsInterface> {
    let toBody = JSON.parse(JSON.stringify(body));
    return this.newsService.createNews({...toBody, author: req.user, img: file.filename});
  }

  @Get('/find')
  @UseGuards(JwtAuthGuard)
  @ApiBody({description: 'Find news on query params'})
  @ApiResponse({ status: 200, description: 'return list news'})
  findNews(@Query() query, @Req() req): Observable<NewsInterface[]> {
    let { take, skip } = query;
    return this.newsService.getNewsFind({
      take: Number(take),
      skip: Number(skip),
      order: { created_at: "ASC" },
      relations: ['author'],
    })
  }

}
