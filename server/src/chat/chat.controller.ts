import {Controller, Get, Param, Post, Query, Req, UseGuards} from '@nestjs/common';
import {ChatService} from "./chat.service";
import {ApiResponse, ApiTags} from "@nestjs/swagger";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {Observable} from "rxjs";
import {ChatInterface} from "./chat.interface";

@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(
    private chatService: ChatService,
  ) {}

  @Get('/one/:id')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 201, description: 'Receive chat on id', type: ChatInterface})
  @ApiResponse({ status: 403, description: 'Forbidden.'})
  getOne(@Param('id') id, @Query() query): Observable<ChatInterface> {
    let defaultQuery = { take: 5, skip: 0 }
    return this.chatService.findOne(id, !!Object.keys(query).length ? query : defaultQuery);
  }

  @Get('/conversation')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 201, description: 'receive all conversation', type: ChatInterface})
  @ApiResponse({ status: 403, description: 'Forbidden.'})
  getAllConversation(@Req() req, @Query() query): Observable<any> {
    return this.chatService.conversation(req.user);
  }
}
