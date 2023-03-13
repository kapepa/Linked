import { Test, TestingModule } from '@nestjs/testing';
import { ChatController } from './chat.controller';
import {ChatService} from "./chat.service";
import {catchError, of, throwError} from "rxjs";
import {ChatClass, MessageClass} from "../core/utility/chat.class";
import {OptionInterface} from "../core/interface/option.interface";
import {ChatInterface} from "./chat.interface";
import {HttpException, HttpStatus, Query} from "@nestjs/common";
import {UserClass} from "../core/utility/user.class";
import {UsersInterface} from "../users/users.interface";
import {MessageInterface} from "./message.interface";
import {UsersDto} from "../users/users.dto";
import {MessageDto} from "./message.dto";

const MockChatService = {
  findOneChat: jest.fn(),
  conversation: jest.fn(),
  findMessage: jest.fn(),
  deleteMessageOnID: jest.fn(),
  companion: jest.fn(),
  getChat: jest.fn(),
  createMessage: jest.fn(),
}

describe('p', () => {
  let controller: ChatController;
  let chatService: ChatService;

  let userClass = UserClass;
  let chatClass = ChatClass;
  let messageClass = MessageClass;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatController],
      providers: [
        { provide: ChatService, useValue: MockChatService }
      ],
    }).compile();

    controller = module.get<ChatController>(ChatController);
    chatService = module.get<ChatService>(ChatService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getOne',() => {
    let req = { param: { id: chatClass.id }, query: { take: 5, skip: 1 }};

    it('should return chat', () => {
      let spyFindOneChat = jest.spyOn(chatService, 'findOneChat').mockImplementation((option: OptionInterface) => of(chatClass as ChatInterface));

      controller.getOne(chatClass.id, req.query).subscribe((chat: ChatInterface) => {
        expect(chat).toEqual(chatClass as ChatInterface);
        expect(spyFindOneChat).toHaveBeenCalled();
      })
    })

    it('should return error 403', () => {
      jest.spyOn(chatService, 'findOneChat').mockReturnValue(throwError(() => new HttpException('Forbidden', HttpStatus.FORBIDDEN)));

      controller.getOne(req.param, req.query).subscribe({
        error: (err) => expect(err.status).toEqual(HttpStatus.FORBIDDEN),
      })
    })
  })

  describe('getAllConversation', () => {
    let req = { user: { userClass }, query: {skip: 0, take: 5, first: 'firstID'} }
    let mockRes: { friends: UsersInterface[], chat: ChatInterface, no: { read: string[] } } = {friends: [userClass] as UsersInterface[], chat: chatClass as ChatInterface, no: { read: [] }};

    it('should return friends and chat', () => {
      let spyConversation = jest.spyOn(chatService, 'conversation').mockImplementation(() => { return of(mockRes) })
      controller.getAllConversation(req.user, req.query).subscribe({
        next: (res: { friends: UsersInterface[], chat: ChatInterface, no: { read: string[] } }) => {
          expect(spyConversation).toHaveBeenCalled();
          expect(res).toEqual(mockRes);
        }
      })
    })

    it('should return error', () => {
      jest.spyOn(chatService, 'conversation').mockReturnValue(throwError(() => new HttpException('Forbidden', HttpStatus.FORBIDDEN)));

      controller.getAllConversation(req.user, req.query).subscribe({
        error: (err) => expect(err.status).toEqual(HttpStatus.FORBIDDEN),
      })
    })
  })

  describe('getMessages', () => {
    let query: {id: string, take: string, skip: string} = {id: messageClass.id, take: '5', skip: '1' };

    it('should return message', () => {
      let messages: MessageInterface[] = [messageClass] as MessageInterface[];
      let spyFindMessage = jest.spyOn(chatService, 'findMessage').mockImplementation((option: OptionInterface) => { return of(messages) });

      controller.getMessages({}, query).subscribe({
        next: (res: {messages: MessageInterface[], limited: boolean}) => {
          expect(res).toEqual({messages: messages, limited: true});
          expect(spyFindMessage).toHaveBeenCalledWith({
            where: { chat: { id: query.id } },
            order: { created_at: "DESC" },
            relations: ['owner', 'chat'],
            skip: Number(query.skip),
            take: Number(query.take),
          })
        }
      })
    })

    it('should return error', () => {
      jest.spyOn(chatService, 'findMessage').mockReturnValue(throwError((option: OptionInterface) => new HttpException('Forbidden', HttpStatus.FORBIDDEN)));

      controller.getMessages({}, query).subscribe({
        error: (err) => expect(err.status).toEqual(HttpStatus.FORBIDDEN),
      })
    })
  })

  describe('deleteMessage', () => {
    let query: {[key: string]: string} = {chat: chatClass.id, message: messageClass.id};
    let user: UsersDto = userClass as UsersDto;

    it('should delete message on id', () => {
      let spyDeleteMessageOnID = jest.spyOn(chatService, 'deleteMessageOnID').mockImplementation((chatID: string, messageID: string, user: UsersDto) => of())

      controller.deleteMessage(query, user).subscribe({
        next: () => expect(spyDeleteMessageOnID).toHaveBeenCalled(),
      })
    })

    it('should return error', () => {
      jest.spyOn(chatService, 'deleteMessageOnID').mockReturnValue(throwError((chatID: string, messageID: string, user: UsersDto) => new HttpException('Forbidden', HttpStatus.FORBIDDEN)));

      controller.deleteMessage(query, user).subscribe({
        error: (err) => expect(err.status).toEqual(HttpStatus.FORBIDDEN),
      })
    })
  })

  describe('companion', () => {
    let mockUser = userClass as UsersInterface;

    it('should return companion on conversation', () => {
      let spyCompanion = jest.spyOn(chatService,'companion').mockImplementation((id: string) => of(mockUser));

      controller.companion(mockUser.id, {}).subscribe({
        next: ( user: UsersInterface ) => {
          expect(user).toEqual(mockUser);
          expect(spyCompanion).toHaveBeenCalled();
        }
      })
    })

    it('should return error', () => {
      jest.spyOn(chatService, 'companion').mockReturnValue(throwError((id: string) => new HttpException('Forbidden', HttpStatus.FORBIDDEN)));

      controller.companion(mockUser.id, {}).subscribe({
        error: (err) => expect(err.status).toEqual(HttpStatus.FORBIDDEN),
      })
    })
  })

  describe('changeChat', () => {
    let mockChat: ChatInterface = chatClass as ChatInterface;
    let mockUser = userClass as UsersInterface;
    let mockFriendID = 'friendID';

    it('should return chat own id and friend id', () => {
      let mockGetChat = jest.spyOn(chatService, 'getChat').mockImplementation((friendID: string, user: UsersDto) => of(mockChat));

      controller.changeChat(mockFriendID, mockUser).subscribe({
        next: (chat: ChatInterface) => {
          expect(chat).toEqual(mockChat);
          expect(mockGetChat).toHaveBeenCalled();
        }
      })
    })

    it('should return error', () => {
      jest.spyOn(chatService, 'getChat').mockReturnValue(throwError((friendID: string, user: UsersDto) => new HttpException('Forbidden', HttpStatus.FORBIDDEN)));

      controller.changeChat(mockFriendID, mockUser).subscribe({
        error: (err) => expect(err.status).toEqual(HttpStatus.FORBIDDEN)
      })
    })
  })

  describe('sendNewMessage', () => {
    let mockChat: ChatInterface = chatClass as ChatInterface;
    let mockMessage: MessageInterface = messageClass as MessageInterface;
    let mockUser = userClass as UsersInterface;

    it('should return new message', () => {
      let spyCreateMessage = jest.spyOn(chatService, 'createMessage').mockImplementation((chatID: string, message: MessageDto, user: UsersDto) => of(mockMessage));

      controller.sendNewMessage(mockChat.id, mockMessage as MessageDto, mockUser).subscribe({
        next: (message: MessageInterface) => {
          expect(message).toEqual(mockMessage);
          expect(spyCreateMessage).toHaveBeenCalled();
        }
      })
    })

    it('should return error', () => {
      jest.spyOn(chatService, 'createMessage').mockReturnValue(throwError(() => new HttpException('Forbidden', HttpStatus.FORBIDDEN)));

      controller.sendNewMessage(mockChat.id, mockMessage as MessageDto, mockUser).subscribe({
        error: (err) => expect(err.status).toEqual(HttpStatus.FORBIDDEN),
      })
    })
  })
});
