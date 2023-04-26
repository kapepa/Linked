import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import {NewsService} from "./news.service";
import {ApiBody, ApiConsumes, ApiResponse, ApiTags} from "@nestjs/swagger";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {FileInterceptor} from "@nestjs/platform-express";
import {multerOption} from "../file/file.service";
import {Observable, of} from "rxjs";
import {NewsInterface} from "./news.interface";
import {NewsDto} from "./news.dto";
import {DeleteResult} from "typeorm";

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
  @ApiResponse({ status: 201, description: 'Create new news'})
  @UseInterceptors(FileInterceptor('img', multerOption ))
  createNews(@UploadedFile() file: Express.Multer.File, @Body() body, @Req() req): Observable<NewsDto | NewsInterface> {
    let toBody = JSON.parse(JSON.stringify(body));
    return this.newsService.createNews({...toBody, author: req.user, img: file ? file?.filename : ''});
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

  @Get('/one/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBody({description: 'Get one news on param id'})
  @ApiResponse({ status: 200, description: 'return one news'})
  oneNews(@Param() param,  @Req() req): Observable<NewsInterface> {
    return this.newsService.getNewsOne({ where: { id: param.id }, relations: ['author'] });
  }

  @Delete('/del/:id')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'should be delete news on id'})
  delNews(@Param('id') param): Observable<DeleteResult> {
    return this.newsService.delNews(param);
  }
}
