import * as request from 'supertest';
import {Test} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';
import {AppModule} from "../src/app.module";
import {UserClass} from "../src/core/utility/user.class";
import {config} from "dotenv";
import {MemoryDb, ProfileInterface} from "./utility/memory.db";
import {DeleteResult, Repository} from "typeorm";
import {User} from "../src/users/users.entity";
import {EventInterface} from "../src/event/event.interface";
import {EventClass} from "../src/core/utility/event.class";

config();

describe('Event (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;

  let userClass = { firstName: UserClass.firstName, lastName: UserClass.lastName, password: '123456', email: UserClass.email, avatar: UserClass.avatar };
  let eventClass = { img: EventClass.img, link: EventClass.link, time: EventClass.time, title: EventClass.title, type: EventClass.type, description: EventClass.description};
  let userData: ProfileInterface = {token: undefined, profile: undefined};
  let eventData: {event: EventInterface} = {event: undefined};

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    userRepository = moduleRef.get('UserRepository');
    await app.init();

    await MemoryDb.createUser(userClass, userRepository).then(async (user) => {
      userData.profile = user;
      userData.token = await MemoryDb.createToken(user);
    });
  });

  afterAll(async () => {
    await MemoryDb.deleteUser(userData.profile.id, userRepository);
    await app.close();
  })

  describe('(POST) createEvent()', () => {
    it('should be create event and return his', () => {
      return request(app.getHttpServer())
        .post('/event/create')
        .set('Authorization', `Bearer ${userData.token}`)
        .send(eventClass)
        .expect(201)
        .expect((res: Response & {body: EventInterface}) => {
          eventData.event = res.body;
          expect(res.body).toEqual({img: '', user: MemoryDb.userValue(userData.profile), id: res.body.id, ...res.body});
        })
    })
  })

  describe('(GET) oneEvent()', () => {
    it('should be return event on id', () => {
      return request(app.getHttpServer())
        .get(`/event/one/${eventData.event.id}`)
        .set('Authorization', `Bearer ${userData.token}`)
        .expect(200)
        .expect((res: Response) => {
          let {user, ...event} = eventData.event;
          expect(res.body).toEqual({...event, img: ''});
        })
    })
  })

  describe('(GET) listEvent()', () => {
    it('should be return list event', () => {
      let query = {take: 1, skip: 0};
      return request(app.getHttpServer())
        .get(`/event/list?take=${query.take}&skip=${query.skip}`)
        .set('Authorization', `Bearer ${userData.token}`)
        .expect(200)
        .expect((res: Response & {body: EventInterface[]}) => {
          expect(res.body.length).toEqual(1);
        })
    })
  })

  describe('(DELETE) deleteEvent()', () => {
    it('should be delete event on id', () => {
      return request(app.getHttpServer())
        .delete(`/event/del/${eventData.event.id}`)
        .set('Authorization', `Bearer ${userData.token}`)
        .expect(200)
        .expect((res: Response & {body: DeleteResult}) => {
          expect(res.body).toEqual({ raw: [], affected: 1 });
        })
    })
  })
});