import * as request from 'supertest';
import {HttpException, HttpStatus, INestApplication} from "@nestjs/common";
import {ChatService} from "../src/chat/chat.service";
import {Test} from "@nestjs/testing";
import {ChatClass, MessageClass} from "../src/core/utility/chat.class";
import {from, of, throwError} from "rxjs";
import {AppModule} from "../src/app.module";
import {config} from "dotenv";
import * as jwt from "jsonwebtoken";
import {UserClass} from "../src/core/utility/user.class";

config();

let mockChatService = {
  findOneChat: jest.fn(),
  conversation: jest.fn(),
  findMessage: jest.fn(),
}

describe('ChatController  (e2e)',  () => {
  let app: INestApplication;

  let userClass = UserClass;
  let chatClass = ChatClass;
  let messageClass = MessageClass;

  let authToken = jwt.sign({
    firstName: UserClass.firstName,
    id: UserClass.id,
    role: UserClass.role,
    avatar: UserClass.avatar,
  }, process.env.JWT_SECRET)

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    })
      .overrideProvider(ChatService)
      .useValue(mockChatService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  describe(`/GET getOne`, () => {
    it(`should return chats`, () => {
      let findOneChat = jest.spyOn(mockChatService, 'findOneChat').mockImplementation(() => of(UserClass));

      return request(app.getHttpServer())
        .get(`/chat/one/${UserClass.id}?take=5&skip=0`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect(userClass)
        .expect(() => {
          expect(findOneChat).toHaveBeenCalledWith({ where: { id: UserClass.id }, take: '5', skip: '0'})
        });
    });

    it(`chat not find`, () => {
      let findOneChat = jest.spyOn(mockChatService, 'findOneChat').mockRejectedValue(new HttpException('Forbidden', HttpStatus.FORBIDDEN));

      return request(app.getHttpServer())
        .get(`/chat/one/${userClass.id}?take=5&skip=0`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(403)
        .expect('{"statusCode":403,"message":"Forbidden"}')
        .expect(() => {
          expect(findOneChat).toHaveBeenCalledWith({ where: { id: UserClass.id }, take: '5', skip: '0'});
        })
    });
  })

  describe('/GET getAllConversation', () => {
    it('should find all chat', () => {
      let mockResponse = { friends: [UserClass], chat: {...ChatClass, chat: [MessageClass]}, no: { read: ['fakeID'] } }
      let spyOnConversation = jest.spyOn(mockChatService, 'conversation').mockImplementation(() => of(mockResponse));

      return request(app.getHttpServer())
        .get('/chat/conversation?skip=0&take=1&first=fakeID')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect(JSON.stringify(mockResponse))
        .expect((res: Response) => {
          expect(spyOnConversation).toHaveBeenCalledWith(
            { firstName: UserClass.firstName, id: UserClass.id, role: UserClass.role, avatar: UserClass.avatar},
            { skip: '0', take: '1', first: 'fakeID' }
          )
        })
    })

    it('should be Forbidden', () => {
      let spyOnConversation = jest.spyOn(mockChatService, 'conversation').mockRejectedValue( new HttpException('Forbidden', HttpStatus.FORBIDDEN));

      return request(app.getHttpServer())
        .get('/chat/conversation?skip=0&take=1&first=fakeID')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.FORBIDDEN)
        .expect('{"statusCode":403,"message":"Forbidden"}')
        .expect(() => {
          expect(spyOnConversation).toHaveBeenCalledWith(
            { firstName: UserClass.firstName, id: UserClass.id, role: UserClass.role, avatar: UserClass.avatar},
            { skip: '0', take: '1', first: 'fakeID' }
          )
        })
    })
  })

  describe('/GET getMessages', () => {
    it('should return array message', () => {
      let findMessage = jest.spyOn(mockChatService, 'findMessage').mockImplementation(jest.fn(() => of([MessageClass])));

      return request(app.getHttpServer())
        .get(`/chat/messages?id=${chatClass.id}&take=1&skip=0`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect(JSON.stringify({messages: [MessageClass], limited: false}))
        .expect(() => {
          expect(findMessage).toHaveBeenCalledWith({
            where: { chat: { id: chatClass.id } },
            order: { created_at: "DESC" },
            relations: ['owner', 'chat'],
            skip: 0,
            take: 1,
          })
        })
    })

    it('should be Forbidden', () => {
      let findMessage = jest.spyOn(mockChatService, 'findMessage').mockRejectedValue( new HttpException('Forbidden', HttpStatus.FORBIDDEN));

      return request(app.getHttpServer())
        .get(`/chat/messages?id=${chatClass.id}&take=1&skip=0`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.FORBIDDEN)
        .expect('{"statusCode":403,"message":"Forbidden"}')
        .expect(() => {
          expect(findMessage).toHaveBeenCalledWith({
            where: { chat: { id: chatClass.id } },
            order: { created_at: "DESC" },
            relations: ['owner', 'chat'],
            skip: 0,
            take: 1,
          })
        })
    })
  })

  afterAll(async () => {
    await app.close();
  });
});