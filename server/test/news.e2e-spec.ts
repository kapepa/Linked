import * as request from 'supertest';
import {Test} from '@nestjs/testing';
import {HttpException, HttpStatus, INestApplication} from '@nestjs/common';
import {AppModule} from "../src/app.module";
import {NewsService} from "../src/news/news.service";
import {NewsClass} from "../src/core/utility/news.class";
import {UserClass} from "../src/core/utility/user.class";
import * as jwt from "jsonwebtoken";
import {config} from "dotenv";
import {of} from "rxjs";
import {JwtService} from "@nestjs/jwt";

config();

const newsService = {
  createNews: jest.fn(),
  getNewsFind: jest.fn(),
  getNewsOne: jest.fn(),
}

describe('News (e2e)', () => {
  let app: INestApplication;

  let newsClass = NewsClass;
  let userClass = UserClass;

  let authToken = new JwtService(
    {secret: process.env.JWT_TOKEN}
  ).sign(
    {
      firstName : userClass.firstName,
      lastName: userClass.lastName,
      id: userClass.id,
      role: userClass.role,
      avatar: userClass.avatar,
    }
  )

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(NewsService)
      .useValue(newsService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  describe('createNews', () => {
    it(`/GET cats`, () => {
      let createNews = jest.spyOn(newsService, 'createNews').mockImplementation(() => of(userClass))

      return request(app.getHttpServer())
        .post('/news/create')
        .set('Authorization', `Bearer ${authToken}`)
        .send({file: {} as Express.Multer.File, body: UserClass })
        .expect(201)
        .expect(() => {
          expect(createNews).toHaveBeenCalled();
        })
    });

    it('should be Forbidden', () => {
      let createNews = jest.spyOn(newsService, 'createNews').mockRejectedValue(new HttpException('Forbidden', HttpStatus.FORBIDDEN))

      return request(app.getHttpServer())
        .post('/news/create')
        .set('Authorization', `Bearer ${authToken}`)
        .send({file: {} as Express.Multer.File, body: UserClass })
        .expect(HttpStatus.FORBIDDEN)
        .expect(() => {
          expect(createNews).toHaveBeenCalled();
        })
    })
  })

  describe('findNews', () => {
    it('should be return array news', () => {
      let getNewsFind = jest.spyOn(newsService, 'getNewsFind').mockImplementation(() => of([newsClass]));

      return request(app.getHttpServer())
        .get(`/news/find?take=1&skip=0`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect(JSON.stringify([newsClass]))
        .expect(() => {
          expect(getNewsFind).toHaveBeenCalledWith({
            take: 1,
            skip: 0,
            order: { created_at: "ASC" },
            relations: ['author'],
          })
        })
    })

    it('should be Forbidden', () => {
      let getNewsFind = jest.spyOn(newsService, 'getNewsFind').mockRejectedValue(new HttpException('Forbidden', HttpStatus.FORBIDDEN));

      return request(app.getHttpServer())
        .get(`/news/find?take=1&skip=0`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.FORBIDDEN)
        .expect(() => {
          expect(getNewsFind).toHaveBeenCalledWith({
            take: 1,
            skip: 0,
            order: { created_at: "ASC" },
            relations: ['author'],
          })
        })
    })
  })

  describe('oneNews', () => {
    it('should be return news on id', () => {
      let getNewsOne = jest.spyOn(newsService, 'getNewsOne').mockImplementation(() => of(newsClass));

      return request(app.getHttpServer())
        .get(`/news/one/${newsClass.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect(() => {
          expect(getNewsOne).toHaveBeenCalledWith({ where: { id: newsClass.id }, relations: ['author'] })
        })
    })

    it('should be Forbidden', () => {
      let getNewsOne = jest.spyOn(newsService, 'getNewsOne').mockRejectedValue(new HttpException('Forbidden', HttpStatus.FORBIDDEN));

      return request(app.getHttpServer())
        .get(`/news/one/${newsClass.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.FORBIDDEN)
        .expect(() => {
          expect(getNewsOne).toHaveBeenCalledWith({ where: { id: newsClass.id }, relations: ['author'] })
        })
    })
  })

  afterAll(async () => {
    await app.close();
  });
});