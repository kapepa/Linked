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
import {DeleteResult} from "typeorm";
import {JwtService} from "@nestjs/jwt";

config();

let mockChatService = {
  findOneChat: jest.fn(),
  conversation: jest.fn(),
  findMessage: jest.fn(),
  deleteMessageOnID: jest.fn(),
  companion: jest.fn(),
  getChat: jest.fn(),
  createMessage: jest.fn()
}

describe('ChatController  (e2e)',  () => {
  let app: INestApplication;

  let userClass = UserClass;
  let chatClass = ChatClass;
  let messageClass = MessageClass;

  let authToken = new JwtService(
    {secret: process.env.JWT_TOKEN}
  ).sign(
    {
      firstName : UserClass.firstName,
      lastName: UserClass.lastName,
      id: UserClass.id,
      role: UserClass.role,
      avatar: UserClass.avatar,
    }
  )

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
      let findMessage = jest.spyOn(mockChatService, 'findMessage').mockImplementation( jest.fn(() => {
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN)
      }) );

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

  describe('/DELETE deleteMessage', () => {
    it('should delete message on id', () => {
      let result: DeleteResult = { raw: 'error', affected: 200 };
      let deleteMessageOnID = jest.spyOn(mockChatService, 'deleteMessageOnID').mockImplementation(jest.fn(() => of(result)));

      return request(app.getHttpServer())
        .delete(`/chat/messages?chat=${ChatClass.id}&message=${MessageClass.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect(result)
        .expect(() => {
          expect(deleteMessageOnID).toHaveBeenCalledWith(ChatClass.id, MessageClass.id, { firstName: UserClass.firstName, id: UserClass.id, role: UserClass.role, avatar: UserClass.avatar})
        })
    })

    it('should be Forbidden', () => {
      let deleteMessageOnID = jest.spyOn(mockChatService, 'deleteMessageOnID').mockRejectedValue(new HttpException('Forbidden', HttpStatus.FORBIDDEN));

      return request(app.getHttpServer())
        .delete(`/chat/messages?chat=${ChatClass.id}&message=${MessageClass.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.FORBIDDEN)
        .expect('{"statusCode":403,"message":"Forbidden"}')
        .expect(() => {
          expect(deleteMessageOnID).toHaveBeenCalledWith(ChatClass.id, MessageClass.id, { firstName: UserClass.firstName, id: UserClass.id, role: UserClass.role, avatar: UserClass.avatar})
        })
    })
  })

  describe('/GET companion', () => {
    it('should return companion in chat', () => {
      let companion = jest.spyOn(mockChatService, 'companion').mockImplementation(() => of(UserClass));

      return request(app.getHttpServer())
        .get(`/chat/companion/${UserClass.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect(JSON.stringify(UserClass))
        .expect(() => {
          expect(companion).toHaveBeenCalledWith(UserClass.id)
        })
    })

    it('should be Forbidden', () => {
      let companion = jest.spyOn(mockChatService, 'companion').mockRejectedValue(new HttpException('Forbidden', HttpStatus.FORBIDDEN));

      return request(app.getHttpServer())
        .get(`/chat/companion/${UserClass.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.FORBIDDEN)
        .expect('{"statusCode":403,"message":"Forbidden"}')
        .expect(() => {
          expect(companion).toHaveBeenCalledWith(UserClass.id)
        })
    })
  })

  describe('/GET changeChat', () => {
    it('should return chant on friend', () => {
      let getChat = jest.spyOn(mockChatService, 'getChat').mockImplementation(() => of(ChatClass));

      return request(app.getHttpServer())
        .get(`/chat/change/${UserClass.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect(JSON.stringify(ChatClass))
        .expect(() => {
          expect(getChat).toHaveBeenCalledWith(UserClass.id, { firstName: UserClass.firstName, id: UserClass.id, role: UserClass.role, avatar: UserClass.avatar})
        })
    })

    it('should be Forbidden', () => {
      let getChat = jest.spyOn(mockChatService, 'getChat').mockRejectedValue(new HttpException('Forbidden', HttpStatus.FORBIDDEN));

      return request(app.getHttpServer())
        .get(`/chat/change/${UserClass.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.FORBIDDEN)
        .expect('{"statusCode":403,"message":"Forbidden"}')
        .expect(() => {
          expect(getChat).toHaveBeenCalledWith(UserClass.id, { firstName: UserClass.firstName, id: UserClass.id, role: UserClass.role, avatar: UserClass.avatar})
        })
    })
  })

  describe('/PUT createMessage',() => {
    it('create new message in chat', () => {
      let {created_at, chat, ...bodyMessage} = MessageClass;
      let createMessage = jest.spyOn(mockChatService, 'createMessage').mockImplementation(() => of(MessageClass));

      return request(app.getHttpServer())
        .put(`/chat/send/${ChatClass.id}`)
        .send(bodyMessage)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect(JSON.stringify(MessageClass))
        .expect(() => {
          expect(createMessage).toHaveBeenCalledWith(ChatClass.id, bodyMessage, { firstName: UserClass.firstName, id: UserClass.id, role: UserClass.role, avatar: UserClass.avatar})
        })
    })

    it('should be Forbidden',() => {
      let {created_at, chat, ...bodyMessage} = MessageClass;
      let createMessage = jest.spyOn(mockChatService, 'createMessage').mockRejectedValue(new HttpException('Forbidden', HttpStatus.FORBIDDEN));

      return request(app.getHttpServer())
        .put(`/chat/send/${ChatClass.id}`)
        .send(bodyMessage)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.FORBIDDEN)
        .expect('{"statusCode":403,"message":"Forbidden"}')
        .expect(() => {
          expect(createMessage).toHaveBeenCalledWith(ChatClass.id, bodyMessage, { firstName: UserClass.firstName, id: UserClass.id, role: UserClass.role, avatar: UserClass.avatar})
        })
    })
  })

  afterAll(async () => {
    await app.close();
  });
});