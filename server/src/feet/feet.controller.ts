import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req, SetMetadata, UseGuards
} from '@nestjs/common';
import {FeetDto} from "./feet.dto";
import {FeetService} from "./feet.service";
import {Observable, of} from "rxjs";
import {FeetInterface} from "./feet.interface";
import {DeleteResult, UpdateResult} from "typeorm";
import {UsersDto} from "../users/users.dto";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {Roles} from "../auth/roles.decorator";
import {Role} from "../auth/role.enum";
import {RolesGuard} from "../auth/roles.guard";
import {ApiResponse, ApiTags} from "@nestjs/swagger";
import {FounderGuard} from "../auth/founder.guard";

@ApiTags('feet')
@Controller('feet')
export class FeetController {
  constructor(private feetService: FeetService) {
  }

  @Post('/create')
  @Roles(Role.User)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiResponse({ status: 201, description: 'The created has been successfully feet.', type: FeetDto})
  @ApiResponse({ status: 403, description: 'Forbidden.'})
  createFeet(@Body() body: FeetDto, @Req() req): Observable<FeetInterface> {
    try {
      return this.feetService.createFeet({...body, author: req.user});
    } catch (err) {
      return err;
;    }
  }

  @Get('/:id')
  @ApiResponse({ status: 200, description: 'The received has been successfully feet on id.', type: FeetDto})
  @ApiResponse({ status: 404, description: 'Forbidden db didn\'t find those feet.'})
  getFeet(@Param('id') id): Observable<FeetInterface> {
    try {
      if (!id) throw new HttpException('server didn\'t get id feet', HttpStatus.NOT_FOUND);
      return this.feetService.getFeet(id);
    } catch (err) {
      return err;
    }
  }

  @Get()
  @ApiResponse({ status: 200, description: 'The received has been successfully feet on params.', type: FeetDto})
  @ApiResponse({ status: 404, description: 'Forbidden db didn\'t find those feet.'})
  allFeet(@Query('take') take: number, @Query('skip') skip: number): Observable<FeetInterface[]> {
    try {
      return this.feetService.allFeet({take: Number(take), skip: Number(skip)});
    } catch (err) {
      return err;
    }
  }

  @Patch('/update/:id')
  @UseGuards(JwtAuthGuard, FounderGuard)
  @ApiResponse({ status: 200, description: 'The received has been successfully update feet.'})
  @ApiResponse({ status: 404, description: 'Forbidden db didn\'t find those feet.'})
  // updateFeet(@Param('id') id: string, @Body() body: FeetDto): Observable<UpdateResult>{
  updateFeet(@Param('id') id: string, @Body() body: FeetDto): Observable<FeetInterface>{
    try {
      if(!Object.keys(body).length) throw new HttpException('Not Found data for update.', HttpStatus.NOT_FOUND);
      return this.feetService.updateFeet(id, body);
    } catch (err) {
      return err
    }
  }
  
  @Delete('/:id')
  @UseGuards(JwtAuthGuard, FounderGuard)
  @ApiResponse({ status: 200, description: 'The received has been successfully delete feet.'})
  @ApiResponse({ status: 404, description: 'Forbidden db didn\'t find those feet.'})
  deleteFeet(@Param('id') id): Observable<DeleteResult>{
    try {
      if(!id) throw new HttpException('Not found feet for id', HttpStatus.NOT_FOUND);
      return this.feetService.deleteFeet(id);
    } catch (err) {
      return err
    }
  }

}
