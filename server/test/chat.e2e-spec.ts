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
import {config} from "dotenv";
import * as jwt from "jsonwebtoken";
import {UserClass} from "../src/core/utility/user.class";
import DoneCallback = jest.DoneCallback;

config();

let mockChatService = {
  findOneChat: jest.fn(),
}

describe('ChatController  (e2e)', () => {
  let app: INestApplication;

  let userClass = UserClass;
  let chatClass = ChatClass;
  let messageClass = MessageClass;

  let authToken = jwt.sign({
    firstName: userClass.firstName,
    id: userClass.id,
    role: userClass.role,
    avatar: userClass.avatar,
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

  describe(`/GET chat`, () => {
    it(`/GET chat`, (done: DoneCallback) => {
      let findOneChat = jest.spyOn(mockChatService, 'findOneChat').mockImplementation( async (a) => Promise.resolve(a) );

      const response = request(app.getHttpServer())
        .get(`/chat/one/${userClass.id}?take=5&skip=0`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          console.log(res.text)

          return done();
        })
    });


  })


  afterAll(async () => {
    await app.close();
  });
});