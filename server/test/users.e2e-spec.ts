import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from "../src/app.module";
import { UsersService } from "../src/users/users.service";
import { of } from "rxjs";
import { UserClass } from "../src/core/utility/user.class";
import { UsersDto } from "../src/users/users.dto";
import * as jwt from "jsonwebtoken";
import { config } from "dotenv";
import {DeleteResult, UpdateResult} from "typeorm";
import {JwtService} from "@nestjs/jwt";

config();

describe('Users', () => {
  let app: INestApplication;
  let mockUser = UserClass as UsersDto;
  let updateResult = {generatedMaps: [], raw: [], affected: 1 } as UpdateResult;
  let mockDeleteResult = { raw: [], affected: 1 } as DeleteResult;

  let authToken = new JwtService(
    {secret: process.env.JWT_TOKEN}
  ).sign(
    {
      firstName : mockUser.firstName,
      lastName: mockUser.lastName,
      id: mockUser.id,
      role: mockUser.role,
      avatar: mockUser.avatar,
    }
  )

  let mockUsersService = {
    avatarUser: jest.fn(() => of({access_token: authToken})),
    findOne: jest.fn(() => of(mockUser)),
    person: jest.fn((id, user) => of({...mockUser, id: 'personID', friends: [mockUser]})),
    updateUser: jest.fn(() => of(updateResult)),
    del: jest.fn(() => of(mockDeleteResult)),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(UsersService)
      .useValue(mockUsersService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  describe('/POST avatar/users', () => {
    it(`Get own profile`, () => {
      return request(app.getHttpServer())
        .post('/users/avatar')
        .set('Authorization', `Bearer ${authToken}`)
        .set({file: {} as Express.Multer.File})
        .expect((res: Response) => {
          expect(res.status).toEqual(201);
          expect(res.body).toBeDefined();
        });
    });

    it('unauthorized', () => {
      return request(app.getHttpServer())
        .post('/users/avatar')
        .expect((res: Response) => {
          expect(res.status).toEqual(401);
          expect(res.body).toEqual({ statusCode: 401, message: 'Unauthorized' });
        });
    })
  })

  describe('/GET users', () => {
    it(`Get own profile`, () => {
      return request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res: Response) => {
          expect(res.status).toEqual(200);
          expect(res.body).toEqual(mockUser);
        });
    });

    it('unauthorized', () => {
      return request(app.getHttpServer())
        .get('/users')
        .expect((res: Response) => {
          expect(res.status).toEqual(401);
          expect(res.body).toEqual({ statusCode: 401, message: 'Unauthorized' });
        });
    })
  })

  describe('/GET users/person/:id', () => {
    it('find user on id', () => {
      return request(app.getHttpServer())
        .get(`/users/person/${mockUser.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect((res: Response) => {
          let { email, request, suggest, friends, ...other} = mockUser;

          expect(res.status).toEqual(200);
          expect(mockUsersService.person).toHaveBeenCalledWith(mockUser.id, other);
          expect(res.body).toEqual({...mockUser, id: 'personID', friends: [mockUser]});
        })
    })

    it('unauthorized', () => {
      return request(app.getHttpServer())
        .get(`/users/person/${mockUser.id}`)
        .expect((res: Response) => {
          expect(res.status).toEqual(401);
          expect(res.body).toEqual({ statusCode: 401, message: 'Unauthorized' });
        });
    })
  })

  describe('/PATCH users/update', () => {
    it('find user on id', () => {
      let mockUpdate = {firstName: 'MockName'} as UsersDto

      return request(app.getHttpServer())
        .patch(`/users/update`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(mockUpdate)
        .expect((res: Response) => {
          expect(res.status).toEqual(200);
          expect(mockUsersService.updateUser).toHaveBeenCalledWith('id', mockUser.id, mockUpdate);
          expect(res.body).toEqual(updateResult);
        })
    })

    it('unauthorized', () => {
      return request(app.getHttpServer())
        .patch(`/users/update`)
        .expect((res: Response) => {
          expect(res.status).toEqual(401);
          expect(res.body).toEqual({ statusCode: 401, message: 'Unauthorized' });
        });
    })
  })

  describe('/DELETE users', () => {
    it('find user on id', () => {

      return request(app.getHttpServer())
        .delete(`/users/${mockUser.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect((res: Response) => {
          expect(res.status).toEqual(200);
          expect(mockUsersService.del).toHaveBeenCalledWith(mockUser.id);
          expect(res.body).toEqual(mockDeleteResult);
        })
    })

    it('unauthorized', () => {
      return request(app.getHttpServer())
        .delete(`/users/${mockUser.id}`)
        .expect((res: Response) => {
          expect(res.status).toEqual(401);
          expect(res.body).toEqual({ statusCode: 401, message: 'Unauthorized' });
        });
    })
  })

  afterAll(async () => {
    await app.close();
  });
});