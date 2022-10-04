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
import {Observable} from "rxjs";
import {FeetInterface} from "./feet.interface";
import {DeleteResult, UpdateResult} from "typeorm";
import {UsersDto} from "../users/users.dto";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {Roles} from "../auth/roles.decorator";
import {Role} from "../auth/role.enum";
import {RolesGuard} from "../auth/roles.guard";

@Controller('feet')
export class FeetController {
  constructor(private feetService: FeetService) {
  }

  @Post('/create')
  @UseGuards(JwtAuthGuard)
  createFeet(@Body() body: FeetDto, @Req() req): Observable<FeetInterface> {
    try {
      return this.feetService.createFeet({...body, author: req.user});
    } catch (err) {
      return err;
;    }
  }

  @Get('/:id')
  @Roles(Role.User)
  getFeet(@Param('id') id): Observable<FeetInterface> {
    try {
      if (!id) throw new HttpException('server didn\'t get id feet', HttpStatus.NOT_FOUND);
      return this.feetService.getFeet(id);
    } catch (err) {
      return err;
    }
  }

  @Get()
  allFeet(@Query('take') take: number, @Query('skip') skip: number): Observable<FeetInterface[]> {
    try {
      return this.feetService.allFeet(take, skip);
    } catch (err) {
      return err;
    }
  }

  @Patch('/update/:id')
  updateFeet(@Param('id') id: string, @Body() body: FeetDto): Observable<UpdateResult>{
    try {
      if(!Object.keys(body).length) throw new HttpException('Not Found data for update.', HttpStatus.NOT_FOUND);
      return this.feetService.updateFeet(id, body);
    } catch (err) {
      return err
    }
  }
  
  @Delete('/:id')
  deleteFeet(@Param('id') id): Observable<DeleteResult>{
    try {
      if(!id) throw new HttpException('Not found feet for id', HttpStatus.NOT_FOUND);
      return this.feetService.deleteFeet(id);
    } catch (err) {
      return err
    }
  }

}
