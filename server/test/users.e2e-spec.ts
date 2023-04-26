import * as request from 'supertest';
import {Test} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';
import {AppModule} from "../src/app.module";
import { UserClass } from "../src/core/utility/user.class";
import {DeleteResult, Repository, UpdateResult} from "typeorm";
import {MemoryDb, ProfileInterface} from "./utility/memory.db";
import {User} from "../src/users/users.entity";
import {UsersInterface} from "../src/users/users.interface";

describe('Users (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;

  let userClass = { firstName: UserClass.firstName, lastName: UserClass.lastName, password: '123456', email: UserClass.email, avatar: UserClass.avatar };
  let friendClass = { firstName: 'FriendFirst', lastName: 'FriendLast', password: '123456', email: 'friend@email.com', avatar: 'friendAvatar.png' };

  let userData: ProfileInterface = { profile: undefined, token: undefined };
  let friendData: ProfileInterface = { profile: undefined, token: undefined };

  let updateResult = {generatedMaps: [], raw: [], affected: 1 } as UpdateResult;
  let mockDeleteResult = { raw: [], affected: 1 } as DeleteResult;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    userRepository = moduleRef.get('UserRepository');
    await app.init();

    await MemoryDb.createUser(userClass, userRepository).then(async (user: UsersInterface) => {
      userData.profile = user;
      userData.token = await MemoryDb.createToken(user);
    });

    await MemoryDb.createUser(friendClass, userRepository).then(async (user: UsersInterface) => {
      friendData.profile = user;
      friendData.token = await MemoryDb.createToken(user);
    })
  });

  afterAll(async () => {
    await MemoryDb.deleteUser(userData.profile.id, userRepository);
    await MemoryDb.deleteUser(friendData.profile.id, userRepository);
    await app.close();
  })

  describe('(GET) getUser()', () => {
    it('should be get user on token', () => {
      return request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${userData.token}`)
        .expect(200)
        .expect((res: Response) => {
          let {created_at, password, ...user} = userData.profile;
          expect(res.body).toEqual(expect.objectContaining(user));
        })
    })
  })

  describe('(GET) person()', () => {
    it('should be return user on id', () => {
      return request(app.getHttpServer())
        .get(`/users/person/${friendData.profile.id}`)
        .set('Authorization', `Bearer ${userData.token}`)
        .expect(200)
        .expect((res: Response) => {
          let { created_at, password, ...friend } = friendData.profile;
          expect(res.body).toEqual(expect.objectContaining(friend))
        })
    })
  })

  describe('(GET) recommended()', () => {
    it('should be return all user exclude myself', () => {
      return request(app.getHttpServer())
        .get('/users/recommended')
        .set('Authorization', `Bearer ${userData.token}`)
        .expect(200)
        .expect((res: Response & { body: UsersInterface[] }) => {
          expect(res.body.length).toBeGreaterThan(0);
        })
    })
  })

  describe('(GET) findUser()', () => {
    it('should be return user on id', () => {
      return request(app.getHttpServer())
        .get(`/users/one/${friendData.profile.id}`)
        .set('Authorization', `Bearer ${userData.token}`)
        .expect(200)
        .expect((res: Response) => {
          let { created_at, password, ...friend } = friendData.profile;
          expect(res.body).toEqual(expect.objectContaining(friend));
        })
    })
  })

  describe('(PATCH) update()', () => {
    let body = { firstName: 'UpdateName' };
    it('should be update profile user', () => {
      return request(app.getHttpServer())
        .patch('/users/update')
        .set('Authorization', `Bearer ${userData.token}`)
        .send(body)
        .expect(200)
        .expect(updateResult)
    })
  })

  describe('(DELETE) del()', () => {
    it('should be delete user for id', async () => {
      let profile = await userRepository.save(userClass);
      return request(app.getHttpServer())
        .delete(`/users/${profile.id}`)
        .set('Authorization', `Bearer ${userData.token}`)
        .expect(200)
        .expect(mockDeleteResult)
    })
  })
});