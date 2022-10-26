import { Test, TestingModule } from '@nestjs/testing';
import {INestApplication, UnauthorizedException} from '@nestjs/common';
import * as request from 'supertest';
import * as jwt from 'jsonwebtoken';
import {AppModule} from "../src/app.module";
import { config } from 'dotenv';
import {UserClass} from "../src/core/utility/user.class";
import {UsersDto} from "../src/users/users.dto";

config()

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  let mockUser = UserClass as UsersDto;

  let authService = {
    loginUser: () => []
  }

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('/ (POST)  login()', () => {
    it('success login and receive jwt token', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({email: "my@mail.com", password: "12345"})
        .expect((res: Response) => {
          const token = res.body['access_token'];
          expect(res.status).toEqual(201);
          expect(jwt.verify(token, process.env.JWT_SECRET)).toBeDefined()
        });
    });

    it('error unauthorized', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({email: "my@mail.com", password: "1234511"})
        .expect((res: Response) => {
          expect(res.body).toEqual( {message: "Unauthorized", statusCode: 401}
        )
        });
    })
  })

  describe('/ (POST)  registration()', () => {
    it('success create user and return boolean', () => {
      let userDto = { firstName: "MockFirstName" , lastName: 'MockLastName', email: 'mock@mail.com', password: '12345'} as UsersDto;

      return request(app.getHttpServer())
        .post('/auth/registration')
        .send(userDto)
        .send({})
        .expect((res: Response) => {
          expect(res.status).toEqual(201);
        })
    })

    it('there is no registration data in the following request', () => {
      return request(app.getHttpServer())
        .post('/auth/registration')
        .send({})
        .expect((res: Response) => {
          expect(res.body).toEqual({statusCode: 400, message: 'There is no registration data in the following request.'})
        })
    })
  })

  it('/ (PUT) RoleAdd()', () => {
    return request(app.getHttpServer())
      .put('/auth/role')
      .expect((res: Response) => {
        expect(res.status).toEqual(200);
      });
  })
});