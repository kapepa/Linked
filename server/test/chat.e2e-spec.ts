import * as request from 'supertest';
import {INestApplication} from "@nestjs/common";
import {Test} from "@nestjs/testing";
import {ChatClass, MessageClass} from "../src/core/utility/chat.class";
import {AppModule} from "../src/app.module";
import {UserClass} from "../src/core/utility/user.class";
import {FriendsInterface} from "../src/friends/friends.interface";
import {CreateProfileTest, ProfileInterface} from "../src/core/utility/create.profile.test";
import {ChatInterface} from "../src/chat/chat.interface";

describe('ChatController (e2e)',  () => {
  let app: INestApplication;

  let userClass = { firstName: UserClass.firstName, lastName: UserClass.lastName, password: '123456', email: UserClass.email, avatar: UserClass.avatar };
  let friendClass = { firstName: 'FirstFriend', lastName: 'LastFriend', password: '123456', email: 'friend@mail.com', avatar: 'FriendAvatar.png' }
  let chatClass = ChatClass;
  let messageClass = MessageClass;

  let userData: ProfileInterface = {token: undefined, profile: undefined};
  let friendData: ProfileInterface = {token: undefined, profile: undefined};
  let chatData: {chat: ChatInterface} = {chat: undefined};

  let friends: FriendsInterface;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    })
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
    //
    // await CreateProfileTest(app, userClass, userData);
    // await CreateProfileTest(app, friendClass, friendData);
    //
    // await request(app.getHttpServer())
    //   .post(`/friends/add/${friendData.profile.id}`).set('Authorization', `Bearer ${userData.token}`)
    //   .expect((res: Response & {body: FriendsInterface} ) => friends = res.body)
    //
    // await request(app.getHttpServer())
    //   .put(`/friends/confirm/${userData.profile.id}`).set('Authorization', `Bearer ${friendData.token}`)
  });

  it('default', () => {
    expect(true).toBeTruthy();
  })

  // afterAll(async () => {
  //   await request(app.getHttpServer())
  //     .delete('/auth/myself')
  //     .set('Authorization', `Bearer ${userData.token}`);
  //   await request(app.getHttpServer())
  //     .delete('/auth/myself')
  //     .set('Authorization', `Bearer ${friendData.token}`);
  // })



  // describe('(GET) getAllConversation()', () => {
  //   let query = {skip: 0, take: 1, first: ''};
  //   it('should be receive chat and friends', () => {
  //     return request(app.getHttpServer())
  //       .get(`/chat/conversation?skip=${query.skip}&take=${query.take}&first=${query.first}`)
  //       .set('Authorization', `Bearer ${userData.token}`)
  //       .expect(200)
  //       .expect((res: Response) => {
  //         console.log(res.body)
  //       })
  //   })
  // })

  // describe(`/GET getOne`, () => {
  //   it(`should return chats`, () => {
  //     let findOneChat = jest.spyOn(mockChatService, 'findOneChat').mockImplementation(() => of(UserClass));
  //
  //     return request(app.getHttpServer())
  //       .get(`/chat/one/${UserClass.id}?take=5&skip=0`)
  //       .set('Authorization', `Bearer ${authToken}`)
  //       .expect(200)
  //       .expect(userClass)
  //       .expect(() => {
  //         expect(findOneChat).toHaveBeenCalledWith({ where: { id: UserClass.id }, take: '5', skip: '0'})
  //       });
  //   });
  // })
  //
  // describe('/GET getAllConversation', () => {
  //   it('should find all chat', () => {
  //     let mockResponse = { friends: [UserClass], chat: {...ChatClass, chat: [MessageClass]}, no: { read: ['fakeID'] } }
  //     let spyOnConversation = jest.spyOn(mockChatService, 'conversation').mockImplementation(() => of(mockResponse));
  //
  //     return request(app.getHttpServer())
  //       .get('/chat/conversation?skip=0&take=1&first=fakeID')
  //       .set('Authorization', `Bearer ${authToken}`)
  //       .expect(200)
  //       .expect(JSON.stringify(mockResponse))
  //       .expect((res: Response) => {
  //         expect(spyOnConversation).toHaveBeenCalledWith(
  //           { lastName: UserClass.lastName, firstName: UserClass.firstName, id: UserClass.id, role: UserClass.role, avatar: UserClass.avatar},
  //           { skip: '0', take: '1', first: 'fakeID' }
  //         )
  //       })
  //   })
  // })
  //
  // describe('/GET getMessages', () => {
  //   it('should return array message', () => {
  //     let findMessage = jest.spyOn(mockChatService, 'findMessage').mockImplementation(jest.fn(() => of([MessageClass])));
  //
  //     return request(app.getHttpServer())
  //       .get(`/chat/messages?id=${chatClass.id}&take=1&skip=0`)
  //       .set('Authorization', `Bearer ${authToken}`)
  //       .expect(200)
  //       .expect(JSON.stringify({messages: [MessageClass], limited: false}))
  //       .expect(() => {
  //         expect(findMessage).toHaveBeenCalledWith({
  //           where: { chat: { id: chatClass.id } },
  //           order: { created_at: "DESC" },
  //           relations: ['owner', 'chat'],
  //           skip: 0,
  //           take: 1,
  //         })
  //       })
  //   })
  // })
  //
  // describe('/DELETE deleteMessage', () => {
  //   it('should delete message on id', () => {
  //     let result: DeleteResult = { raw: 'error', affected: 200 };
  //     let deleteMessageOnID = jest.spyOn(mockChatService, 'deleteMessageOnID').mockImplementation(jest.fn(() => of(result)));
  //
  //     return request(app.getHttpServer())
  //       .delete(`/chat/messages?chat=${ChatClass.id}&message=${MessageClass.id}`)
  //       .set('Authorization', `Bearer ${authToken}`)
  //       .expect(200)
  //       .expect(result)
  //       .expect(() => {
  //         expect(deleteMessageOnID).toHaveBeenCalledWith(ChatClass.id, MessageClass.id, { lastName: UserClass.lastName, firstName: UserClass.firstName, id: UserClass.id, role: UserClass.role, avatar: UserClass.avatar})
  //       })
  //   })
  //
  // })
  //
  // describe('/GET companion', () => {
  //   it('should return companion in chat', () => {
  //     let companion = jest.spyOn(mockChatService, 'companion').mockImplementation(() => of(UserClass));
  //
  //     return request(app.getHttpServer())
  //       .get(`/chat/companion/${UserClass.id}`)
  //       .set('Authorization', `Bearer ${authToken}`)
  //       .expect(200)
  //       .expect(JSON.stringify(UserClass))
  //       .expect(() => {
  //         expect(companion).toHaveBeenCalledWith(UserClass.id)
  //       })
  //   })
  //
  // })
  //
  // describe('/GET changeChat', () => {
  //   it('should return chant on friend', () => {
  //     let getChat = jest.spyOn(mockChatService, 'getChat').mockImplementation(() => of(ChatClass));
  //
  //     return request(app.getHttpServer())
  //       .get(`/chat/change/${UserClass.id}`)
  //       .set('Authorization', `Bearer ${authToken}`)
  //       .expect(200)
  //       .expect(JSON.stringify(ChatClass))
  //       .expect(() => {
  //         expect(getChat).toHaveBeenCalledWith(UserClass.id, { lastName: UserClass.lastName, firstName: UserClass.firstName, id: UserClass.id, role: UserClass.role, avatar: UserClass.avatar})
  //       })
  //   })
  // })
  //
  // describe('/PUT createMessage',() => {
  //   it('create new message in chat', () => {
  //     let {created_at, chat, ...bodyMessage} = MessageClass;
  //     let createMessage = jest.spyOn(mockChatService, 'createMessage').mockImplementation(() => of(MessageClass));
  //
  //     return request(app.getHttpServer())
  //       .put(`/chat/send/${ChatClass.id}`)
  //       .send(bodyMessage)
  //       .set('Authorization', `Bearer ${authToken}`)
  //       .expect(200)
  //       .expect(JSON.stringify(MessageClass))
  //       .expect(() => {
  //         expect(createMessage).toHaveBeenCalledWith(ChatClass.id, bodyMessage, { lastName: UserClass.lastName, firstName: UserClass.firstName, id: UserClass.id, role: UserClass.role, avatar: UserClass.avatar})
  //       })
  //   })
  // })

});