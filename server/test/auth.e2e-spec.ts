import { Test, TestingModule } from '@nestjs/testing';
import {HttpException, HttpStatus, INestApplication, UnauthorizedException} from '@nestjs/common';
import * as request from 'supertest';
import * as jwt from 'jsonwebtoken';
import { AppModule } from "../src/app.module";
import { UserClass } from "../src/core/utility/user.class";
import { UsersDto } from "../src/users/users.dto";
import { AuthService } from "../src/auth/auth.service";
import { AuthModule } from "../src/auth/auth.module";
import {of, throwError} from "rxjs";

import { config } from 'dotenv';

config()

const mockAuthService = {
  loginUser: jest.fn(),
  registrationUser: jest.fn(),
  validateUser: jest.fn(() => of(true)),
}

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  let mockUser = UserClass as UsersDto;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, AuthModule],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('/ (POST)  login()', () => {
    it('success login and receive jwt token', () => {
      jest.spyOn(mockAuthService, 'loginUser').mockImplementationOnce(() => {
        let {firstName, lastName, id, role, avatar} = mockUser;
        let token = jwt.sign({firstName, lastName, id, role, avatar}, process.env.JWT_SECRET);
        return of({access_token: jwt.sign(token, process.env.JWT_SECRET)});
      })

      return request(app.getHttpServer())
        .post('/auth/login')
        .send({email: "my@mail.com", password: "12345"})
        .expect((res: Response) => {
          const token = res.body['access_token'];
          expect(res.status).toEqual(201);
          expect(jwt.verify(token, process.env.JWT_SECRET)).toBeDefined()
        });
    });
  })

  describe('/ (POST)  registration()', () => {
    let userDto = { firstName: "MockFirstName" , lastName: 'MockLastName', email: 'mock@mail.com', password: '12345'} as UsersDto;

    it('success create user and return boolean', () => {
      jest.spyOn(mockAuthService, 'registrationUser').mockImplementation(() => of(true));

      return request(app.getHttpServer())
        .post('/auth/registration')
        .send(userDto)
        .send({})
        .expect((res: Response) => {
          expect(res.status).toEqual(201);
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