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
  Req,
  UseGuards,
} from '@nestjs/common';
import { FeetDto } from "./feet.dto";
import { FeetService } from "./feet.service";
import {from, Observable, throwError} from "rxjs";
import { FeetInterface } from "./feet.interface";
import { DeleteResult, Like } from "typeorm";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Roles } from "../auth/roles.decorator";
import { Role } from "../auth/role.enum";
import { RolesGuard } from "../auth/roles.guard";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { FounderGuard } from "../auth/founder.guard";

@ApiTags('feet')
@Controller('feet')
export class FeetController {
  constructor(private feetService: FeetService) {}

  @Post('/create')
  @Roles(Role.User)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiResponse({ status: 201, description: 'The created has been successfully feet.', type: FeetDto})
  @ApiResponse({ status: 403, description: 'Forbidden.'})
  createFeet(@Body() body: FeetDto, @Req() req): Observable<FeetInterface | FeetDto> {
    return this.feetService.createFeet({...body, author: req.user});
  }

  @Get('/:id')
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

  @Patch('/update/:id')
  @UseGuards(JwtAuthGuard, FounderGuard)
  @ApiResponse({ status: 200, description: 'The received has been successfully update feet.'})
  @ApiResponse({ status: 404, description: 'Forbidden db didn\'t find those feet.'})
  updateFeet(@Param('id') id: string, @Body() body: FeetDto): Observable<FeetInterface | FeetDto>{
    if(!Object.keys(body).length) return throwError(() => new HttpException('Not Found data for update.', HttpStatus.NOT_FOUND));
    return this.feetService.updateFeet(id, body);
  }

  @Put('/like/:id')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'Put my like in post!'})
  @ApiResponse({ status: 404, description: 'Forbidden when set like'})
  postLike(@Param('id') id, @Req() req): Observable<FeetInterface> {
    return this.feetService.likePost(id, req.user);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard, FounderGuard)
  @ApiResponse({ status: 200, description: 'The received has been successfully delete feet.'})
  @ApiResponse({ status: 404, description: 'Forbidden db didn\'t find those feet.'})
  deleteFeet(@Param('id') id): Observable<DeleteResult>{
    if(!id.length) return throwError(() => new HttpException('Not found feet for id', HttpStatus.NOT_FOUND));
    return this.feetService.deleteFeet(id);
  }

}
