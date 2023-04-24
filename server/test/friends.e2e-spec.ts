import * as request from 'supertest';
import {Test} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';
import {AppModule} from "../src/app.module";
import {UserClass} from "../src/core/utility/user.class";
import {DeleteResult, In, Repository} from "typeorm";
import {config} from 'dotenv';
import {User} from "../src/users/users.entity";
import {MemoryDb, ProfileInterface} from "./utility/memory.db";
import {FriendsInterface} from "../src/friends/friends.interface";
import {UsersInterface} from "../src/users/users.interface";
import {FriendsEntity} from "../src/friends/friends.entity";

config();

describe('Friends (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;
  let friendRepository: Repository<FriendsEntity>;

  let userClass = { firstName: UserClass.firstName, lastName: UserClass.lastName, password: '123456', email: UserClass.email, avatar: UserClass.avatar };
  let friendClass = { firstName: 'FriendFirst', lastName: 'FriendLast', password: '123456', email: 'friend@email.com', avatar: 'friendAvatar.png' };

  let userData: ProfileInterface = {token: undefined, profile: undefined};
  let friendData: ProfileInterface = {token: undefined, profile: undefined};

  let suggestFriend: FriendsInterface;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    userRepository = moduleRef.get('UserRepository');
    friendRepository = moduleRef.get('FriendsEntityRepository');
    await app.init();

    await MemoryDb.createUser(friendClass, userRepository).then(async (user) => {
      friendData.profile = user;
      friendData.token = await MemoryDb.createToken(user);
    })

    await MemoryDb.createUser(userClass, userRepository).then(async (profile) => {
      userData.profile = profile;
      userData.token = await MemoryDb.createToken(profile);
    })
  });


  describe('(POST) create()', () => {
    it('should be send suggest add to friend', () => {
      return request(app.getHttpServer())
        .post(`/friends/add/${friendData.profile.id}`)
        .set('Authorization', `Bearer ${userData.token}`)
        .expect(201)
        .expect((res: Response & { body: FriendsInterface }) => {
          let profileCompare = (user: UsersInterface) => {
            let {created_at, password, ...profile} = user;
            return {...profile, friends: [], request: [], suggest: []};
          }
          suggestFriend = res.body;
          expect(res.body)
            .toEqual(expect.objectContaining({
              user: profileCompare(userData.profile),
              friends: profileCompare(friendData.profile),
              status: 'pending',
            }))
        })
    })
  })

  describe('(GET) suggest()', () => {
    it('should be return receive all list offer add to friends', () => {
      return request(app.getHttpServer())
        .get('/friends/suggest')
        .set('Authorization', `Bearer ${userData.token}`)
        .expect(200)
        .expect((res: Response & {body: FriendsInterface[]}) => {
          expect(res.body.length).toEqual(1);
        })
    })
  })

  describe('(GET) offer()', () => {
    it('should be return my list offer add to friends', () => {
      return request(app.getHttpServer())
        .get('/friends/offer')
        .set('Authorization', `Bearer ${userData.token}`)
        .expect(200)
        .expect((res: Response & { body: FriendsInterface[] }) => {
          expect(res.body.length).toEqual(1);
        })
    })
  })

  describe('(PUT) confirm()', () => {
    it('should be confirm offer from friend', () => {
      return request(app.getHttpServer())
        .put(`/friends/confirm/${userData.profile.id}`)
        .set('Authorization', `Bearer ${friendData.token}`)
        .expect(200)
        .expect(async (res: Response) => {
          expect(res.body).toEqual({
            user: expect.objectContaining({id: friendData.profile.id}),
            friend: expect.objectContaining({id: userData.profile.id}),
          })
        })
    })
  })

  // describe('(DELETE) delFriend()', () => {
  //   it('should be delete my friend', async () => {
  //     return request(app.getHttpServer())
  //       .delete(`/friends/delete/${userData.profile.id}`)
  //       .set('Authorization', `Bearer ${friendData.token}`)
  //       .expect(200)
  //       .expect((res: Response & {body: UsersInterface[]}) => {
  //         expect(res.body.length).toEqual(0);
  //       })
  //   })
  // })
  //
  // describe('(DELETE) cancel()', () => {
  //   it('should be canceled offer about friendship', async () => {
  //     let req = await friendRepository.save({user: userData.profile, friends: friendData.profile});
  //
  //     return request(app.getHttpServer())
  //       .delete(`/friends/cancel/${req.id}`)
  //       .set('Authorization', `Bearer ${userData.token}`)
  //       .expect(200)
  //       .expect((res: Response & {body: FriendsInterface[]}) => {
  //         expect(res.body.length).toEqual(0);
  //       })
  //   })
  // })

  afterAll(async () => {
    await MemoryDb.deleteUser(userData.profile.id, userRepository);
    await MemoryDb.deleteUser(friendData.profile.id, userRepository);
    await app.close();
  })
});