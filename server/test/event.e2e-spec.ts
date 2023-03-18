import * as request from 'supertest';
import {Test} from '@nestjs/testing';
import {HttpException, HttpStatus, INestApplication} from '@nestjs/common';
import {EventService} from "../src/event/event.service";
import {AppModule} from "../src/app.module";
import {EventClass} from "../src/core/utility/event.class";
import {of} from "rxjs";
import * as jwt from "jsonwebtoken";
import {UserClass} from "../src/core/utility/user.class";
import {config} from "dotenv";

config();

const eventService = {
  createEvent: jest.fn(),
  findOneEvent: jest.fn(),
  findEvents: jest.fn(),
}

describe('Event (e2e)', () => {
  let app: INestApplication;

  let eventClass = EventClass;

  let authToken = jwt.sign({
    firstName: UserClass.firstName,
    id: UserClass.id,
    role: UserClass.role,
    avatar: UserClass.avatar,
  }, process.env.JWT_SECRET);

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(EventService)
      .useValue(eventService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  describe(`/POST createEvent`, () => {
    it('should create event and return', () => {
      let createEvent = jest.spyOn(eventService, 'createEvent').mockImplementation(() => of(eventClass));

      return request(app.getHttpServer())
        .post('/event/create')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ img: { } as Express.Multer.File, body: eventClass })
        .expect(201)
        .expect(() => {
          expect(createEvent).toHaveBeenCalled();
        })
    })

    it('should be Forbidden', () => {
      let createEvent = jest.spyOn(eventService, 'createEvent').mockRejectedValue(new HttpException('Forbidden', HttpStatus.FORBIDDEN));

      return request(app.getHttpServer())
        .post('/event/create')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ img: { } as Express.Multer.File, body: eventClass })
        .expect(HttpStatus.FORBIDDEN)
        .expect(() => {
          expect(createEvent).toHaveBeenCalled();
        })
    })
  });

  describe('/GET findOneEvent', () => {
    it('should return event on id', () => {
      let findOneEvent = jest.spyOn(eventService, 'findOneEvent').mockImplementation(() => of(eventClass));

      return request(app.getHttpServer())
        .get(`/event/one/${eventClass.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect(JSON.stringify(eventClass))
        .expect(() => {
          expect(findOneEvent).toHaveBeenCalledWith({ where: { id: eventClass.id }})
        })
    })

    it('should be Forbidden', () => {
      let findOneEvent = jest.spyOn(eventService, 'findOneEvent').mockRejectedValue(new HttpException('Forbidden', HttpStatus.FORBIDDEN));

      return request(app.getHttpServer())
        .get(`/event/one/${eventClass.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.FORBIDDEN)
        .expect('{"statusCode":403,"message":"Forbidden"}')
        .expect(() => {
          expect(findOneEvent).toHaveBeenCalledWith({ where: { id: eventClass.id }})
        })
    })
  })

  describe('/GET listEvent', () => {
    it('should return array events', () => {
      let findEvents = jest.spyOn(eventService, 'findEvents').mockImplementation(() => of([eventClass]));

      return request(app.getHttpServer())
        .get(`/event/list?take=1&skip=0`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect(JSON.stringify([eventClass]))
        .expect(() => {
          expect(findEvents).toHaveBeenCalledWith({take: 1, skip: 0});
        })
    })

    it('should be Forbidden', () => {
      let findEvents = jest.spyOn(eventService, 'findEvents').mockRejectedValue(new HttpException('Forbidden', HttpStatus.FORBIDDEN));

      return request(app.getHttpServer())
        .get(`/event/list?take=1&skip=0`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(HttpStatus.FORBIDDEN)
        .expect('{"statusCode":403,"message":"Forbidden"}')
        .expect(() => {
          expect(findEvents).toHaveBeenCalledWith({take: 1, skip: 0});
        })
    })
  })

  afterAll(async () => {
    await app.close();
  });
});