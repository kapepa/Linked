import * as request from 'supertest';
import {Test} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';
import {AppModule} from "../src/app.module";
import {UserClass} from "../src/core/utility/user.class";
import {FeetInterface} from "../src/feet/feet.interface";
import {config} from "dotenv";
import {DeleteResult, Repository} from "typeorm";
import {CommentInterface} from "../src/feet/comment.interface";
import {User} from "../src/users/users.entity";
import {MemoryDb, ProfileInterface} from "./utility/memory.db";
import {AccessEnum} from "../src/feet/access.enum";

config();

describe('Feet (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;

  let userClass = { firstName: UserClass.firstName, lastName: UserClass.lastName, password: '123456', email: UserClass.email, avatar: UserClass.avatar };
  let additionClass = { jobTitle: 'additionJobTitle', company: 'additionCompany', placesWork: 'additionPlacesWork', region: 'additionRegion' };
  let feelClass = { img: ['feetImg.png'], video: '', file: '', body: 'body feet', access: AccessEnum.CONTACT, addition: additionClass }
  let commentClass = { comment: 'comment' }

  let userData: ProfileInterface = {token: undefined, profile: undefined};
  let feelData: {feel: FeetInterface, comment: CommentInterface} = {feel: undefined, comment: undefined};

  let mockDeleteResult: DeleteResult = {raw: [], affected: 1};

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    userRepository = moduleRef.get('UserRepository');
    app = moduleRef.createNestApplication();

    await app.init();

    await MemoryDb.createUser(userClass, userRepository).then( async (user) => {
      userData.profile = user;
      userData.token = await MemoryDb.createToken(user);
    })
  });

  afterAll(async () => {
    await MemoryDb.deleteUser(userData.profile.id, userRepository);
    await app.close();
  })

  describe('(POST) createFeet()', () => {
    it('should be create feet', () => {
      return request(app.getHttpServer())
        .post('/feet/create')
        .set('Authorization', `Bearer ${userData.token}`)
        .send(feelClass)
        .expect(201)
        .expect((res: Response & {body: FeetInterface}) => {
          let { addition, ...feet } = res.body;
          let { id, ...restAddition } = addition
          feelData.feel = res.body;
          expect({...feet, addition: {}}).toEqual(expect.objectContaining({...feelClass, addition: {}}));
          expect(restAddition).toEqual(expect.objectContaining(additionClass));
        })
    })
  })

  describe('(GET) getFeet()', () => {
    it('should be find feet on id', () => {
      return request(app.getHttpServer())
        .get(`/feet/one/${feelData.feel.id}`)
        .set('Authorization', `Bearer ${userData.token}`)
        .expect(200)
        .expect((res: Response) => {
          let { like, ...feel } = feelData.feel
          expect(res.body).toEqual({...feel, comments: []});
        });
    })
  })

  describe('(GET) allFeet()', () => {
    it('should be return array from feel', () => {
      let query = { take: 1, skip: 0 };
      return request(app.getHttpServer())
        .get(`/feet?take=${query.take}&skip=${query.skip}`)
        .set('Authorization', `Bearer ${userData.token}`)
        .expect(200)
        .expect((res: Response) => {
          let { password, created_at, ...author} = userData.profile;
          expect(res.body).toEqual([{...feelData.feel, author}]);
        })
    })
  })

  describe('(PUT) postLike()', () => {
    it('should be set feet line, on id', () => {
      return request(app.getHttpServer())
        .put(`/feet/like/${feelData.feel.id}`)
        .set('Authorization', `Bearer ${userData.token}`)
        .expect(200)
        .expect((res: Response) => {
          let { password, created_at, ...profile} = userData.profile;
          expect(res.body).toEqual(expect.objectContaining({...feelData.feel, like_count: 1, like: [profile]}))
        })
    })
  })

  describe('(POST) commentCreate()', () => {
    it('should be create comment in feet on id', () => {
      return request(app.getHttpServer())
        .post(`/feet/comment/create/${feelData.feel.id}`)
        .set('Authorization', `Bearer ${userData.token}`)
        .send(commentClass)
        .expect(201)
        .expect((res: Response & {body: CommentInterface}) => {
          feelData.comment = res.body;
          expect(res.body).toEqual(expect.objectContaining(commentClass));
        })
    })
  })

  describe('(GET) getComment()', () => {
    it('should be find comment on id feet', () => {
      let query = { id: feelData.feel.id, take: 1, skip: 0 };
      return request(app.getHttpServer())
        .get(`/feet/comments?id=${query.id}&take=${query.take}&skip=${query.skip}`)
        .set('Authorization', `Bearer ${userData.token}`)
        .expect(200)
        .expect((res: Response) => {
          expect(res.body).toEqual([feelData.comment]);
        })
    })
  })

  describe('(DELETE) deleteComment()', () => {
    it('should be delete comment on id', () => {
      return request(app.getHttpServer())
        .delete(`/feet/comment/${feelData.comment.id}`)
        .set('Authorization', `Bearer ${userData.token}`)
        .expect(200)
        .expect(mockDeleteResult)
    })
  })

  describe('(DELETE) deleteFeet()' ,() => {
    it('should be delete feet on id', () => {
      return request(app.getHttpServer())
        .delete(`/feet/${feelData.feel.id}`)
        .set('Authorization', `Bearer ${userData.token}`)
        .expect(200)
        .expect(mockDeleteResult)
    })
  })
});