import {Test, TestingModule} from '@nestjs/testing';
import {ExecutionContext, HttpStatus, INestApplication} from '@nestjs/common';
import * as request from 'supertest';
import {AppModule} from "../src/app.module";
import {UsersDto} from "../src/users/users.dto";
import {GoogleOAuthGuard} from "../src/auth/google-oauth.guard";
import {FacebookGuard} from "../src/auth/facebook.guard";

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  let mockUser = {
    firstName: 'FirstNameTest',
    lastName: 'LastNameTest',
    email: 'emailTest@mail.com',
    avatar: 'MyAvatar.png',
    password: '12345'
  } as UsersDto;
  let mockSocial = {
    email: mockUser.email,
    firstName: mockUser.firstName,
    lastName: mockUser.lastName,
    avatar: mockUser.avatar,
  };
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(GoogleOAuthGuard).useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          req.user = mockSocial;
          return true;
        },
      })
      .overrideGuard(FacebookGuard).useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          req.user = mockSocial;
          return true;
        }
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('(POST) registration()', () => {
    it('success create user and return boolean', () => {
      return request(app.getHttpServer())
        .post('/auth/registration')
        .send(mockUser)
        .expect(201)
        .expect((res: Response) => {
          expect(res.body).toBeTruthy();
        })
    })
  })

  describe('(POST) login()', () => {
    it('success login and receive jwt token', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({email: mockUser.email, password: mockUser.password})
        .expect((res: Response) => {
          token = res.body['access_token'];
        });
    });
  })

  describe('(POST) social()', () => {
    it('should be success registration of social', () => {
      return request(app.getHttpServer())
        .post('/auth/social')
        .send(mockUser)
        .expect(201)
        .expect((res: Response) => {
          token = res.body['access_token'];
        })
    })
  })

  describe('(PUT) roleAdd()', () => {
    it('set role', () => {
      return request(app.getHttpServer())
        .put('/auth/role')
        .expect(200)
    })
  })

  describe('(GET) AuthGoogle()', () => {
    it('should be receive data for registration from google', () => {
      return request(app.getHttpServer())
        .get('/auth/google')
        .set('user', mockSocial as any)
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockSocial);
        })
    })
  })

  describe('(GET) RedirectGoogle()', () => {
    it('should be registration from google', () => {
      return request(app.getHttpServer())
        .get('/auth/google-redirect')
        .expect(200)
    })
  })

  describe('(GET) AuthFacebook()', () => {
    it('should be receive data for registration from facebook', () => {
      return request(app.getHttpServer())
        .get('/auth/facebook')
        .set('user', mockSocial as any)
        .expect(200)
    })
  })

  describe('(GET) RedirectFacebook()', () => {
    it('should be registration from facebook', () => {
      return request(app.getHttpServer())
        .get('/auth/facebook/redirect')
        .expect(200)
    })
  })

  describe('(DELETE) DeleteMyself()', () => {
    it('should be delete myself reg', () => {
      return request(app.getHttpServer())
        .delete('/auth/myself')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    })
  })
});