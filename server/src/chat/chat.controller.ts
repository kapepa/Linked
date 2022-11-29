import {Controller, Get, Param, Post, Query, Req, UseGuards} from '@nestjs/common';
import {ChatService} from "./chat.service";
import {ApiResponse, ApiTags} from "@nestjs/swagger";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {from, Observable, of, switchMap, take} from "rxjs";
import {ChatInterface} from "./chat.interface";
import {MessageInterface} from "./message.interface";

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
    // return this.chatService.findOne(id, !!Object.keys(query).length ? query : defaultQuery);
    return from([])
  }

  @Get('/conversation')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 201, description: 'receive all conversation', type: ChatInterface})
  @ApiResponse({ status: 403, description: 'Forbidden.'})
  getAllConversation(@Req() req, @Query() query): Observable<any> {
    return this.chatService.conversation(req.user, query);
  }

  @Get('/messages')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 201, description: 'receive message on query params', type: ChatInterface})
  @ApiResponse({ status: 403, description: 'Forbidden.'})
  getMessages(@Req() req, @Query() query: {id: string, take: string, skip: string}) {
    return this.chatService.findMessage({
      where: { chat: { id: query.id } },
      order: { created_at: "DESC" },
      relations: ['owner', 'chat'],
      skip: Number(query.skip),
      take: Number(query.take),
    }).pipe(
      take(1),
      switchMap((messages: MessageInterface[]) => {
        let reqMessage = messages.reverse();
        return from([{messages: reqMessage, limited: reqMessage.length !== Number(query.take)}]);
      })
    )
  }

  @Get('/change/:friendID')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 201, description: 'find chat, and return chat and message', type: ChatInterface})
  @ApiResponse({ status: 403, description: 'Forbidden.'})
  changeChat(@Param() param, @Req() req): Observable<any>{
    return this.chatService.getChat(param.friendID, req.user);
  }

}
