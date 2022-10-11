import {Controller, Param, Post, Query, Req, UseGuards} from '@nestjs/common';
import {ApiForbiddenResponse, ApiResponse, ApiTags} from "@nestjs/swagger";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {Observable} from "rxjs";
import {FriendsService} from "./friends.service";

@ApiTags('friends')
@Controller('friends')
export class FriendsController {

  constructor(
    private friendsService: FriendsService,
  ) {}

  @Post('/add/:friendsID')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 201, description: 'The record has been successfully created.'})
  @ApiResponse({ status: 403, description: 'Not found friends'})
  @ApiForbiddenResponse({ description: 'Forbidden.'})
  create(@Param('friendsID') friendsID, @Req() req): Observable<any> {
    return this.friendsService.create(friendsID, req.user)
  }
}
