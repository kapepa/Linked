import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import {AppModule} from './../src/app.module';
import {AppService} from "../src/app.service";

const mockAppService = {
  getHello: jest.fn(),
}

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(AppService)
      .useValue(mockAppService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    let res = 'Hello World!'
    jest.spyOn(mockAppService, 'getHello').mockImplementation(() => res);

    return request(app.getHttpServer())
      .get('/app')
      .expect(200)
      .expect(res);
  });
});
