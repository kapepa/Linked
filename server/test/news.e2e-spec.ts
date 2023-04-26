import * as request from 'supertest';
import {Test} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';
import {AppModule} from "../src/app.module";
import {NewsClass} from "../src/core/utility/news.class";
import {UserClass} from "../src/core/utility/user.class";
import {DeleteResult, Repository} from "typeorm";
import {User} from "../src/users/users.entity";
import {MemoryDb, ProfileInterface} from "./utility/memory.db";
import {NewsInterface} from "../src/news/news.interface";

describe('News (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;

  let userClass = { firstName: UserClass.firstName, lastName: UserClass.lastName, password: '123456', email: UserClass.email, avatar: UserClass.avatar };
  let newsClass = { title: NewsClass.title, img: NewsClass.img, content: NewsClass.content };

  let userData: ProfileInterface = { profile: undefined, token: undefined };
  let newsDate: {news: NewsInterface} = { news: undefined };

  let mockDeleteResult: DeleteResult = {raw: [], affected: 1};

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    userRepository = moduleRef.get('UserRepository');
    await app.init();

    await MemoryDb.createUser(userClass, userRepository).then( async (user) => {
      userData.token = await MemoryDb.createToken(user);
      userData.profile = user;
    })
  });

  describe('(POST) createNews()', () => {
    it('should be create news', () => {
      return request(app.getHttpServer())
        .post(`/news/create`)
        .set('Authorization', `Bearer ${userData.token}`)
        .send(newsClass)
        .expect(201)
        .expect((res: Response & { body: NewsInterface }) => {
          expect(res.body).toEqual(expect.objectContaining({...newsClass, img: ''}));
          newsDate.news = res.body;
        })
    })
  })

  describe('(GET) findNews()', () => {
    let query: { take: number, skip: number } = { take: 1, skip: 0 };
    it('should be return news array', () => {
      return request(app.getHttpServer())
        .get(`/news/find?take=${query.take}&skip=${query.skip}`)
        .set('Authorization', `Bearer ${userData.token}`)
        .expect(200)
        .expect((res: Response & {body: NewsInterface[]}) => {
          expect(res.body.length).toEqual(1);
        })
    })
  })

  describe('(GET) oneNews()', () => {
    it('should be return news on id', () => {
      return request(app.getHttpServer())
        .get(`/news/one/${newsDate.news.id}`)
        .set('Authorization', `Bearer ${userData.token}`)
        .expect(200)
        .expect((res: Response) => {
          expect({...res.body, author: {}}).toEqual(expect.objectContaining({...newsDate.news, author: {}}));
        })
    })
  })

  describe('(DELETE) delNews()', () => {
    it('should be delete news on id', () => {
      return request(app.getHttpServer())
        .delete(`/news/del/${newsDate.news.id}`)
        .set('Authorization', `Bearer ${userData.token}`)
        .expect(200)
        .expect(mockDeleteResult);
    })
  })

  afterAll( async () => {
    await MemoryDb.deleteUser(userData.profile.id, userRepository);
    await app.close();
  })
});