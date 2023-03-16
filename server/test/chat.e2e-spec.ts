import * as request from 'supertest';
import {INestApplication} from "@nestjs/common";
import {ChatService} from "../src/chat/chat.service";
import {Test} from "@nestjs/testing";
import {ChatModule} from "../src/chat/chat.module";
import {ChatClass, MessageClass} from "../src/core/utility/chat.class";
import {of} from "rxjs";
import {ChatInterface} from "../src/chat/chat.interface";
import {TypeOrmModule} from "@nestjs/typeorm";
import {JwtModule} from "@nestjs/jwt";
import {Chat} from "../src/chat/chat.entity";
import {MessageEntity} from "../src/chat/message.entity";
import {AppModule} from "../src/app.module";

let mockChatService = {
  findOneChat: jest.fn(),
}

describe('ChatController  (e2e)', () => {
  let app: INestApplication;

  let chatClass = ChatClass;
  let messageClass = MessageClass;

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

  it(`/GET chat`, () => {
    jest.spyOn(mockChatService, 'findOneChat').mockImplementation(() => of(chatClass as ChatInterface));

    return request(app.getHttpServer())
      .get('/api/chat/one/:id')
      // .expect(200)
      .expect(chatClass);
  });


  // afterAll(async () => {
  //   await app.close();
  // });
});