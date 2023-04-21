import * as request from 'supertest';
import {INestApplication} from "@nestjs/common";
import {Test} from "@nestjs/testing";
import {ChatClass, MessageClass} from "../src/core/utility/chat.class";
import {AppModule} from "../src/app.module";
import {UserClass} from "../src/core/utility/user.class";
import {ChatInterface} from "../src/chat/chat.interface";
import {User} from "../src/users/users.entity";
import {Chat} from "../src/chat/chat.entity";
import * as dotenv from "dotenv";
import {Repository} from "typeorm";
import {MemoryDb, ProfileInterface} from "./utility/memory.db";
import {MessageInterface} from "../src/chat/message.interface";

dotenv.config();

describe('ChatController (e2e)',  () => {
  let app: INestApplication;
  let userRepository: Repository<User>;
  let chatRepository: Repository<Chat>;

  let userClass = { firstName: UserClass.firstName, lastName: UserClass.lastName, password: '123456', email: UserClass.email, avatar: UserClass.avatar };
  let friendClass = { firstName: 'FirstFriend', lastName: 'LastFriend', password: '123456', email: 'friend@mail.com', avatar: 'FriendAvatar.png' }

  let userData: ProfileInterface = {token: undefined, profile: undefined};
  let friendData: ProfileInterface = {token: undefined, profile: undefined};
  let chatData: {chat: ChatInterface, message: MessageInterface} = {chat: undefined, message: undefined};

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        AppModule,
      ]
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    userRepository = moduleRef.get('UserRepository');
    chatRepository = moduleRef.get('ChatRepository');

    await MemoryDb.createUser(userClass, userRepository).then(async (user) => {
      userData.profile = user;
      userData.token = await MemoryDb.createToken(user);
    })

    await MemoryDb.createUser(friendClass, userRepository).then(async (user) => {
      friendData.profile = user;
      friendData.token = await MemoryDb.createToken(user);
    })

    await chatRepository.save({conversation: [userData.profile, friendData.profile]}).then( async (chat) => {
      chatData.chat = chat;
      await userRepository.save({...userData.profile, chat: [chat], friends: [friendData.profile]});
      await userRepository.save({...friendData.profile, chat: [chat], friends: [userData.profile]});
    });


  });

  afterAll(async () => {
    await MemoryDb.deleteUser(userData.profile.id, userRepository);
    await MemoryDb.deleteUser(friendData.profile.id, userRepository);
    await chatRepository.delete({id: chatData.chat.id});
    await app.close();
  })

  describe('(GET) getAllConversation()', () => {
    let query = { take: 1, skip: 0 };

    it('should be return all conversation', () => {
      return request(app.getHttpServer())
        .get(`/chat/conversation?take=${query.take}&skip=${query.skip}`)
        .set('Authorization', `Bearer ${userData.token}`)
        .expect(200)
        .expect((res: Response) => {
          let { created_at, password, ...friend } = friendData.profile;
          expect(res.body).toEqual({friends: [friend], chat: { chat: [] }, no: { read: [] }})
        })
    })
  })

  describe('(GET) getOne()', () => {
    it('should be return chat on id', () => {
      return request(app.getHttpServer())
        .get(`/chat/one/${chatData.chat.id}`)
        .set('Authorization', `Bearer ${userData.token}`)
        .expect(200)
        .expect((res: Response) => {
          let { chat, conversation, ...otherChat } = chatData.chat;
          expect(res.text).toEqual(JSON.stringify(otherChat));
        })
    })
  })

  describe('(GET) companion()', () => {
    it('should be find companion in chat, on id chat', () => {
      return request(app.getHttpServer())
        .get(`/chat/companion/${friendData.profile.id}`)
        .set('Authorization', `Bearer ${userData.token}`)
        .expect(200)
        .expect((res: Response) => {
          expect(res.body).toEqual(MemoryDb.userValue(friendData.profile));
        })
    })
  })

  describe('(GET) changeChat()', () => {
    it('should be return chat on friend id', () => {
      return request(app.getHttpServer())
        .get(`/chat/change/${friendData.profile.id}`)
        .set('Authorization', `Bearer ${userData.token}`)
        .expect(200)
        .expect((res: Response) => {
          expect(res.body['id']).toEqual(chatData.chat.id);
          expect(res.body['conversation'].length).toEqual(2);
          expect(res.body['chat'].length).toEqual(0);
        })
    })
  })

  describe('(PUT) sendNewMessage()', () => {
    let message = 'Message text.'
    it('should be append new message to chat', () => {
      return request(app.getHttpServer())
        .put(`/chat/send/${chatData.chat.id}`)
        .set('Authorization', `Bearer ${userData.token}`)
        .send({message})
        .expect(200)
        .expect((res: Response & {body: MessageInterface}) => {
          chatData.message = res.body;
          expect(res.body.message).toEqual(message);
        })
    })
  })

  describe('(GET) getMessages()', () => {
    it('should be return message from chat on id chat', () => {
      let query = { take: 1, skip: 0 };

      return request(app.getHttpServer())
        .get(`/chat/messages?take=${query.take}&skip=${query.skip}`)
        .set('Authorization', `Bearer ${userData.token}`)
        .expect(200)
        .expect((res: Response) => {
          expect(res.body['messages'].length).toEqual(1);
          expect(res.body['limited']).toBeFalsy();
        })
    })
  })

  describe('(DELETE) deleteMessage()', () => {
    it('should be delete message on id', () => {
      return request(app.getHttpServer())
        .delete(`/chat/messages?chat=${chatData.chat.id}&message=${chatData.message.id}`)
        .set('Authorization', `Bearer ${userData.token}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual({ raw: [], affected: 1 });
        })
    })
  })
});