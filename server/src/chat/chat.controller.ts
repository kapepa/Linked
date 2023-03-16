import {Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards} from '@nestjs/common';
import {ChatService} from "./chat.service";
import {ApiResponse, ApiTags} from "@nestjs/swagger";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {from, Observable, of, switchMap, take} from "rxjs";
import {ChatInterface} from "./chat.interface";
import {MessageInterface} from "./message.interface";
import {UsersInterface} from "../users/users.interface";

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
    return this.chatService.findOneChat({ where: { id }, ...!!Object.keys(query).length ? query : defaultQuery});
  }

  @Get('/conversation')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 201, description: 'receive all conversation', type: ChatInterface})
  @ApiResponse({ status: 403, description: 'Forbidden.'})
  getAllConversation(@Req() req, @Query() query): Observable<{ friends: UsersInterface[], chat: ChatInterface, no: { read: string[] } }> {
    return this.chatService.conversation(req.user, query);
  }

  @Get('/messages')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 201, description: 'receive message on query params', type: ChatInterface})
  @ApiResponse({ status: 403, description: 'Forbidden.'})
  getMessages(@Req() req, @Query() query: {id: string, take: string, skip: string}):
    Observable<{messages: MessageInterface[], limited: boolean}> {
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

  @Delete('/messages')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 201, description: 'delete own messages, on id', type: MessageInterface})
  @ApiResponse({ status: 403, description: 'Forbidden.'})
  deleteMessage(@Query() query, @Req() req): Observable<any> {
    let { chat, message } = query
    return this.chatService.deleteMessageOnID(chat, message, req.user);
  }

  @Get('/companion/:id')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 201, description: 'find friends, which have in chat', type: UsersInterface})
  @ApiResponse({ status: 403, description: 'Forbidden.'})
  companion(@Param('id') param, @Req() req): Observable<UsersInterface> {
    return this.chatService.companion(param);
  }

  @Get('/change/:friendID')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 201, description: 'find chat, and return chat and message', type: ChatInterface})
  @ApiResponse({ status: 403, description: 'Forbidden.'})
  changeChat(@Param() param, @Req() req): Observable<ChatInterface>{
    return this.chatService.getChat(param.friendID, req.user);
  }

  @Put('/send/:chatID')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 201, description: 'send and set new message in chat', type: MessageInterface})
  @ApiResponse({ status: 403, description: 'Forbidden.'})
  sendNewMessage(@Param('chatID') chatID, @Body() body, @Req() req): Observable<MessageInterface> {
    return this.chatService.createMessage(chatID, body, req.user);
  }

}
