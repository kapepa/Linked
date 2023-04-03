import {Test, TestingModule} from '@nestjs/testing';
import {ChatGateway} from './chat.gateway';
import {ChatService} from "./chat.service";
import {JwtModule, JwtService} from "@nestjs/jwt";
import {config} from "dotenv";
import {MessageInterface} from "./message.interface";
import {Server} from "socket.io";

config()

const mockChatService = {
  findOneChat: jest.fn(),
}

describe('ChatGateway', () => {
  let gateway: ChatGateway;
  let server: Server;

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
    // let mockServerTo = jest.spyOn(gateway.server, 'to').mockImplementation((attr: any) => attr);
    // let mockServerEmit = jest.spyOn(gateway.server, 'emit').mockImplementation((attr: any) => attr);

    gateway.newMessage('friendID', 'userID', 'chatID', {} as MessageInterface);
  })
});
