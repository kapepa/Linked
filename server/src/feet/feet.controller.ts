import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post, Put,
  Query,
  Req, UploadedFile, UploadedFiles,
  UseGuards, UseInterceptors,
} from '@nestjs/common';
import { FeetDto } from "./feet.dto";
import { FeetService } from "./feet.service";
import {Observable, of, switchMap, throwError} from "rxjs";
import { FeetInterface } from "./feet.interface";
import { DeleteResult, Like } from "typeorm";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Roles } from "../auth/roles.decorator";
import { Role } from "../auth/role.enum";
import { RolesGuard } from "../auth/roles.guard";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { FounderGuard } from "../auth/founder.guard";
import { CommentInterface } from "./comment.interface";
import {FileFieldsInterceptor, FileInterceptor} from "@nestjs/platform-express";
import { FileService, multerOption, } from "../file/file.service";

@ApiTags('feet')
@Controller('feet')
export class FeetController {
  constructor(
    private feetService: FeetService,
    private fileService: FileService
  ) {}

  @Post('/create')
  // @Roles(Role.User)
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @UseInterceptors(FileInterceptor('img', multerOptionImg))
  // @UseInterceptors(FileInterceptor('video', multerOptionVideo))
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'img', maxCount: 1 },
    { name: 'video', maxCount: 1 },
  ], multerOption))
  @ApiResponse({ status: 201, description: 'The created has been successfully feet.', type: FeetDto})
  @ApiResponse({ status: 403, description: 'Forbidden.'})
  createFeet(
    @Body() body: FeetDto,
    // @UploadedFiles() files,
    @UploadedFiles() file,
    @Req() req,
  ): Observable<FeetInterface | FeetDto> {
    // return this.fileService.formFile(img.filename).pipe(
    //   switchMap((save: boolean) => {
    //     return this.feetService.createFeet({...JSON.parse(JSON.stringify(body)), img: img.filename, author: req.user})
    //   })
    // )
    console.log( file)
    return of({} as FeetInterface | FeetDto)
  }

  @Patch('/update/:id')
  @UseGuards(JwtAuthGuard, FounderGuard)
  @UseInterceptors(FileInterceptor('img', multerOption))
  @ApiResponse({ status: 200, description: 'The received has been successfully update feet.'})
  @ApiResponse({ status: 404, description: 'Forbidden db didn\'t find those feet.'})
  updateFeet(
    @Param('id') id: string,
    @UploadedFile() img: Express.Multer.File,
    @Body() body: FeetDto
  ): Observable<FeetInterface | FeetDto>{
    if(!Object.keys(body).length) return throwError(() => new HttpException('Not Found data for update.', HttpStatus.NOT_FOUND));
    return  this.fileService.formFile(img.filename).pipe(
      switchMap(() => this.feetService.updateFeet({ id, img: img.filename, ...JSON.parse(JSON.stringify(body)) })),
    )
  }

  @Get('/one/:id')
  @ApiResponse({ status: 200, description: 'The received has been successfully feet on id.', type: FeetDto})
  @ApiResponse({ status: 404, description: 'Forbidden db didn\'t find those feet.'})
  getFeet(@Param('id') id): Observable<FeetInterface> {
    if (!id.length) return throwError(() => new HttpException('server didn\'t get id feet', HttpStatus.NOT_FOUND));
    return this.feetService.getFeet(id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'The received has been successfully feet on params.', type: FeetDto})
  @ApiResponse({ status: 404, description: 'Forbidden db didn\'t find those feet.'})
  allFeet(@Query() query, @Req() req): Observable<FeetInterface[]> {
    let { take, skip, word } = query;
    let where = !!word.length ? {  where: { body: Like(`%${word}%`) }  } : {};
    return this.feetService.findFeetList({ ...where, take: Number(take), skip: Number(skip) }, req.user);
  }

  @Put('/like/:id')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'Put my like in post!'})
  @ApiResponse({ status: 404, description: 'Forbidden when set like'})
  postLike(@Param('id') id, @Req() req): Observable<FeetInterface> {
    return this.feetService.likePost(id, req.user);
  }

  @Get('/comments')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'get comment in feet on query'})
  @ApiResponse({ status: 404, description: 'didn\'t get comment'})
  getComment(@Query() query): Observable<CommentInterface[]> {
    return this.feetService.getComment(query);
  }

  @Post('/comment/create/:id')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'create new comment'})
  @ApiResponse({ status: 404, description: 'didn\'t create comment'})
  commentCreate(@Param('id') id, @Body() body: CommentInterface, @Req() req): Observable<any> {
    return this.feetService.commentCreate(id, body, req.user);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard, FounderGuard)
  @ApiResponse({ status: 200, description: 'The received has been successfully delete feet.'})
  @ApiResponse({ status: 404, description: 'Forbidden db didn\'t find those feet.'})
  deleteFeet(@Param('id') id): Observable<DeleteResult>{
    if(!id.length) return throwError(() => new HttpException('Not found feet for id', HttpStatus.NOT_FOUND));
    return this.feetService.deleteFeet(id);
  }

  @Delete('/comment/:id')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'The successfully delete comment on id.'})
  @ApiResponse({ status: 404, description: 'Forbidden db didn\'t find those comment.'})
  deleteComment(@Param('id') id, @Req() req): Observable<DeleteResult> {
    return this.feetService.deleteComment(id, req.user);
  }
}
