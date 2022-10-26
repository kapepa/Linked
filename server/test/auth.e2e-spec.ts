import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import {AuthModule} from "../src/auth/auth.module";
import {AppModule} from "../src/app.module";
import {TypeOrmModule} from "@nestjs/typeorm";

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let authService = {
    loginUser: () => []
  }

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AuthModule,
        TypeOrmModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (POST)  login()', () => {
    return request('http://localhost:5000/api/auth/login')
      .post('/login')
      .expect(201)
      .set({email: "my@mail.com", password: "12345"})
      .expect((response: Response) => {
        console.log(response)

        expect(true).toBeTruthy()
      });
  });
});