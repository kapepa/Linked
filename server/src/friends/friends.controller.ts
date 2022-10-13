import { Controller, Delete, Get, HttpStatus, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiForbiddenResponse, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Observable } from "rxjs";
import { FriendsService } from "./friends.service";
import { FriendsInterface } from "./friends.interface";
import { DeleteResult } from "typeorm";

@ApiTags('friends')
@Controller('friends')
export class FriendsController {

  constructor(
    private friendsService: FriendsService,
  ) {}

  @Post('/add/:friendsID')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'The record has been successfully created.', type: FriendsInterface})
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Your request already exists'})
  @ApiForbiddenResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found friends'})
  create(@Param('friendsID') friendsID, @Req() req): Observable<FriendsInterface> {
    return this.friendsService.create(friendsID, req.user)
  }

  @Get('/suggest')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'Receive all suggest add to friends', type: FriendsInterface})
  @ApiForbiddenResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found friends'})
  suggest(@Req() req): Observable<FriendsInterface[]> {
    return this.friendsService.suggest(req.user.id)
  }

  @Get('/offer')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'My offer on friends'})
  @ApiForbiddenResponse({ status: HttpStatus.BAD_REQUEST, description: 'Something went wrong with friend'})
  offer(@Req() req): Observable<FriendsInterface[]>{
    return this.friendsService.offer(req.user)
  }

  @Put('/confirm/:requestID')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'Confirm successfully add to friends'})
  @ApiForbiddenResponse({ status: HttpStatus.BAD_REQUEST, description: 'Something went wrong with friend'})
  @ApiForbiddenResponse({ status: HttpStatus.BAD_REQUEST, description: 'Such a friend is already in friends'})
  confirm(@Param('requestID') requestID, @Req() req): Observable<any>{
    return this.friendsService.confirm(requestID, req.user)
  }

  @Delete('/cancel/:requestID')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'Cancel to friend'})
  @ApiForbiddenResponse({ status: HttpStatus.BAD_REQUEST, description: 'Something went wrong with friend'})
  cancel(@Param('requestID') requestID, @Req() req): Observable<DeleteResult>{
    return this.friendsService.cancel(requestID, req.user)
  }

  @Delete('/delete/:friendID')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, description: 'Cancel to friend'})
  @ApiForbiddenResponse({ status: HttpStatus.BAD_REQUEST, description: 'Something went wrong with friend'})
  delFriend(@Param('friendID') friendID, @Req() req): Observable<any> {
    return this.friendsService.delFriend(friendID, req.user);
  }

}
