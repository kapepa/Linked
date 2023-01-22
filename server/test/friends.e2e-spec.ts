import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from "../src/app.module";
import { FriendsService } from "../src/friends/friends.service";
import { FriendCLass } from "../src/core/utility/friend.class";
import { FriendsDto } from "../src/friends/friends.dto";
import { UserClass } from "../src/core/utility/user.class";
import { UsersDto } from "../src/users/users.dto";
import * as jwt from "jsonwebtoken";
import { config } from 'dotenv';
import {of} from "rxjs";
import {DeleteResult} from "typeorm";

config();

describe('Friends', () => {
  let app: INestApplication;
  let mockUser = UserClass as UsersDto;
  let mockFriend = FriendCLass as FriendsDto;
  let jwt_token = jwt.sign(
    {
      firstName : mockUser.firstName,
      lastName: mockUser.lastName,
      id: mockUser.id,
      role: mockUser.role,
      avatar: mockUser.avatar,
    } as UsersDto,
    process.env.JWT_SECRET
  );

  const mockDeleteResult: DeleteResult = {
    raw: [],
    affected: 1,
  };

  let mockFriendsService = {
    create: jest.fn((id, user) => {
      return of({ ...mockFriend, user, friends: { id } });
    }),
    suggest: jest.fn((id) => {
      return of([{...mockUser, suggest: [mockFriend]} as UsersDto].find(user => user.id === id).suggest);
    }),
    offer: jest.fn((id) => {
      return of([{...mockUser, request: [mockUser]} as UsersDto].find(user => user.id === id).request);
    }),
    confirm: jest.fn((id) => of(mockUser)),
    cancel: jest.fn((id) => of(mockDeleteResult)),
    delFriend: jest.fn(() => of(mockDeleteResult)),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(FriendsService)
      .useValue(mockFriendsService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  describe('/POST friends/add/:id', () => {
    let friendID = 'friendID';
    it('success create friend on id', () => {
      return request(app.getHttpServer())
        .post(`/friends/add/${mockFriend.id}`)
        .set('Authorization', `Bearer ${jwt_token}`)
        .expect((res: Response) => {
          let { email, request, suggest, friends, ...other} = mockUser;

          expect(res.status).toEqual(201);
          expect(mockFriendsService.create).toHaveBeenCalledWith(friendID, other);
          expect(res.body).toEqual({ ...mockFriend, user: other, friends: { id: friendID } })
        });
    });

    it('unauthorized', () => {
      return request(app.getHttpServer())
        .post(`/friends/add/${mockFriend.id}`)
        .expect((res: Response) => {
          expect(res.status).toEqual(401);
          expect(res.body).toEqual({ statusCode: 401, message: 'Unauthorized' });
        });
    })
  });

  describe('/GET friends/suggest', () => {
    it('receive all suggest about friending', () => {
      return request(app.getHttpServer())
        .get('/friends/suggest')
        .set('Authorization', `Bearer ${jwt_token}`)
        .expect((res: Response) => {
          expect(res.status).toEqual(200);
          expect(mockFriendsService.suggest).toHaveBeenCalledWith(mockUser.id);
          expect(res.body).toEqual( [ mockFriend ])
        })
    })

    it('unauthorized', () => {
      return request(app.getHttpServer())
        .get('/friends/suggest')
        .expect((res: Response) => {
          expect(res.status).toEqual(401);
          expect(res.body).toEqual({ statusCode: 401, message: 'Unauthorized' });
        });
    })
  })

  describe('/GET friends/offer', () => {
    it('receive all offer about friending', () => {
      return request(app.getHttpServer())
        .get('/friends/offer')
        .set('Authorization', `Bearer ${jwt_token}`)
        .expect((res: Response) => {

          expect(res.status).toEqual(200);
          expect(mockFriendsService.suggest).toHaveBeenCalledWith(mockUser.id);
          expect(res.body).toEqual( [ mockUser ]);
        })
    })

    it('unauthorized', () => {
      return request(app.getHttpServer())
        .get('/friends/offer')
        .expect((res: Response) => {
          expect(res.status).toEqual(401);
          expect(res.body).toEqual({ statusCode: 401, message: 'Unauthorized' });
        });
    })
  })

  describe('/PUT confirm/:id', () => {
    it('confirm offer friends', () => {
      return request(app.getHttpServer())
        .put(`/friends/confirm/${mockFriend.id}`)
        .set('Authorization', `Bearer ${jwt_token}`)
        .expect((res: Response) => {
          let { email, request, suggest, friends, ...other} = mockUser;

          expect(res.status).toEqual(200);
          expect(mockFriendsService.confirm).toHaveBeenCalledWith(mockFriend.id, other);
          expect(res.body).toEqual(mockUser);
        })
    })

    it('unauthorized', () => {
      return request(app.getHttpServer())
        .put(`/friends/confirm/${mockFriend.id}`)
        .expect((res: Response) => {
          expect(res.status).toEqual(401);
          expect(res.body).toEqual({ statusCode: 401, message: 'Unauthorized' });
        });
    })
  })

  describe('/DELETE cancel/:id', () => {
    it('cancel offer friends', () => {
      return request(app.getHttpServer())
        .delete(`/friends/cancel/${mockFriend.id}`)
        .set('Authorization', `Bearer ${jwt_token}`)
        .expect((res: Response) => {
          let { email, request, suggest, friends, ...other} = mockUser;

          expect(res.status).toEqual(200);
          expect(mockFriendsService.cancel).toHaveBeenCalledWith(mockFriend.id, other);
          expect(res.body).toEqual(mockDeleteResult);
        })
    })

    it('unauthorized', () => {
      return request(app.getHttpServer())
        .delete(`/friends/cancel/${mockFriend.id}`)
        .expect((res: Response) => {
          expect(res.status).toEqual(401);
          expect(res.body).toEqual({ statusCode: 401, message: 'Unauthorized' });
        });
    })
  })

  describe('/DELETE delete/:id', () => {
    it('del friends', () => {
      return request(app.getHttpServer())
        .delete(`/friends/delete/${mockFriend.id}`)
        .set('Authorization', `Bearer ${jwt_token}`)
        .expect((res: Response) => {
          let { email, request, suggest, friends, ...other} = mockUser;

          expect(res.status).toEqual(200);
          expect(mockFriendsService.cancel).toHaveBeenCalledWith(mockFriend.id, other);
          expect(res.body).toEqual(mockDeleteResult);
        })
    })

    it('unauthorized', () => {
      return request(app.getHttpServer())
        .delete(`/friends/delete/${mockFriend.id}`)
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