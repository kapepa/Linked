import {Test, TestingModule} from '@nestjs/testing';
import {ChatGateway} from './chat.gateway';
import {ChatService} from "./chat.service";
import {JwtModule, JwtService} from "@nestjs/jwt";
import {config} from "dotenv";
import {MessageInterface} from "./message.interface";

config()

const mockChatService = {
  findOneChat: jest.fn(),
}

describe('ChatGateway', () => {
  let gateway: ChatGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '30d' },
        }),
      ],
      providers: [
        ChatGateway,
        { provide: ChatService, useValue: mockChatService },
      ],
    }).compile();

    gateway = module.get<ChatGateway>(ChatGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  it('handleMessage', async () => {
    gateway.handleMessage({} as any, {id: 'messageID', dto: {} as MessageInterface})
  })

  it('appendToRoom', async () => {
    let mocJoin = jest.fn();
    gateway.appendToRoom({join: mocJoin}, {roomID: 'roomID'});

    expect(mocJoin).toHaveBeenCalledWith('roomID');
  })

  it('newMessage', () => {
    gateway.server = {to: jest.fn(() => gateway.server), emit: jest.fn(() => gateway.server)} as any;
    let to = jest.spyOn(gateway.server, 'to');
    let emit = jest.spyOn(gateway.server, 'emit');

    gateway.newMessage('friendID', 'userID', 'chatID', {} as MessageInterface);
    expect(to).toHaveBeenCalledWith('friendID');
    expect(emit).toHaveBeenCalledWith('new-message', { friend: {id: 'userID'}, chat: {id: 'chatID'}, message: {} as MessageInterface });
  })

  it('deleteMessage', () => {
    gateway.server = {to: jest.fn(() => gateway.server), except: jest.fn(() => gateway.server), emit: jest.fn(() => gateway.server)} as any;
    let to = jest.spyOn(gateway.server, 'to');
    let except = jest.spyOn(gateway.server,'except');
    let emit = jest.spyOn(gateway.server, 'emit');

    gateway.deleteMessage('chatID', 'messageID', 'userID');
    expect(to).toHaveBeenCalledWith('chatID');
    expect(except).toHaveBeenCalledWith('userID');
    expect(emit).toHaveBeenCalledWith('deleteMessage', 'messageID');
  })
});
