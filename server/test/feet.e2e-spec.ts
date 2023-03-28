import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import {ForbiddenException, HttpException, HttpStatus, INestApplication} from '@nestjs/common';
import { FeetService } from "../src/feet/feet.service";
import { AppModule } from "../src/app.module";
import { UserClass } from "../src/core/utility/user.class";
import { UsersDto } from "../src/users/users.dto";
import {FeetClass} from "../src/core/utility/feet.class";
import {FeetInterface} from "../src/feet/feet.interface";
import {catchError, of} from "rxjs";
import { config } from "dotenv";
import {FeetDto} from "../src/feet/feet.dto";
import {DeleteResult} from "typeorm";
import {JwtService} from "@nestjs/jwt";

config();

describe('Feet (e2e)', () => {
  let app: INestApplication;
  let mockUser = UserClass as UsersDto;
  let mockFeet = FeetClass as FeetInterface;
  let mockDeleteResult: DeleteResult = {raw: [], affected: 1,};
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
  let mockFeetService = {
    getFeet: jest.fn(),
    createFeet: jest.fn(),
    updateFeet: jest.fn((id: string, data: FeetDto) => {
      let feet = [mockFeet].find(feet => feet.id === id);
      if(!Object.keys(feet).length) throw new HttpException('Forbidden db didn\'t find those feet.', HttpStatus.BAD_REQUEST);
      return of({...feet, ...data});
    }),
    allFeet: jest.fn(({take, skip}) => {
      let list = [mockFeet, {...mockFeet, id: 'feetOne'}].slice(skip, take);
      if(!list.length) throw new HttpException('db didn\'t not found feet.', HttpStatus.NOT_FOUND)
      return of(list);
    }),
    deleteFeet: jest.fn((id: string) => {
      let feet = [mockFeet].find(feet => feet.id === id);
      if(!Object.keys(feet).length) throw new HttpException('Something went wrong when delete feet.', HttpStatus.NOT_FOUND);
      return mockDeleteResult;
    })
  };


  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(FeetService)
      .useValue(mockFeetService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  describe('/POST feet/create', () => {
    it(`success create feet`, () => {
      jest.spyOn(mockFeetService, 'createFeet').mockReturnValueOnce(of( {...mockFeet, author: mockUser} ))

      return request(app.getHttpServer())
        .post('/feet/create')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ body: mockFeet.body } as FeetDto)
        .expect((res: Response) => {
          expect(res.status).toEqual(201);
          expect(res.body).toEqual({...mockFeet, author: mockUser});
        });
    });

    it('forbidden', () => {
      jest.spyOn(mockFeetService, 'createFeet').mockRejectedValue( new ForbiddenException() );

      return request(app.getHttpServer())
        .post('/feet/create')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ body: mockFeet.body } as FeetDto)
        .expect((res: Response) => {
          expect(res.status).toEqual(403);
          expect(res.body).toEqual({ statusCode: 403, message: 'Forbidden' })
        });
    })
  })


  describe('/GET feet/:id', () => {
    it('should return feet on id', () => {
      jest.spyOn(mockFeetService, 'getFeet').mockReturnValueOnce(of(mockFeet));

      return request(app.getHttpServer())
        .get(`/feet/${mockFeet.id}`)
        .expect((res: Response) => {
          expect(res.status).toEqual(200);
          expect(res.body).toEqual(mockFeet);
        })
    });
  })

  describe('/GET feet', () => {
    it('should return FeetInterface[] on query params', () => {
      return request(app.getHttpServer())
        .get('/feet?take=2&skip=0')
        .expect((res: Response & {body: FeetInterface[]}) => {
          expect(res.status).toEqual(200);
          expect(mockFeetService.allFeet).toHaveBeenCalledWith({take: 2, skip: 0});
          expect(res.body.length).toEqual(2);
        })
    })

    it('Forbidden db didn\'t find those feet.', () => {
      return request(app.getHttpServer())
        .get('/feet?take=2&skip=2')
        .expect((res: Response) => {
          expect(res.status).toEqual(404);
          expect(mockFeetService.allFeet).toHaveBeenCalledWith({take: 2, skip: 2})
          expect(res.body).toEqual({ statusCode: 404, message: "db didn't not found feet." })
        })
    })
  })

  describe('/PATCH feet/update/:id', () => {
    let mockBody = 'Update feet';

    it('should success update feet and return current feet', () => {
      return request(app.getHttpServer())
        .patch(`/feet/update/${mockFeet.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({body: mockBody})
        .expect((res: Response & {body: FeetInterface}) => {
          expect(res.status).toEqual(200);
          expect(mockFeetService.updateFeet).toHaveBeenCalledWith(mockFeet.id, {body: mockBody});
          expect(res.body).toEqual({ id: mockFeet.id, body: mockBody, author: {} });
        })
    })

    it('Forbidden db didn\'t find those feet.', () => {
      return request(app.getHttpServer())
        .patch(`/feet/update/mockID`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({body: mockBody})
        .expect((res: Response) => {
          expect(res.status).toEqual(403);
          expect(mockFeetService.updateFeet).toHaveBeenCalledWith(mockFeet.id, {body: mockBody});
          expect(res.body).toEqual({ statusCode: 403, message: 'Forbidden resource', error: 'Forbidden' });
        })
    })

    it('Not Found data for update.', () => {
      return request(app.getHttpServer())
        .patch(`/feet/update/${mockFeet.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({})
        .expect((res: Response) => {
          expect(res.status).toEqual(404);
          expect(res.body).toEqual({ statusCode: 404, message: 'Not Found data for update.' })
        })
    })
  })

  describe('/DELETE feet/:id', () => {
    it('should success delete feet on id', () => {
      return request(app.getHttpServer())
        .delete(`/feet/${mockFeet.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect((res: Response) => {
          expect(res.status).toEqual(200);
          expect(mockFeetService.deleteFeet).toHaveBeenCalledWith(mockFeet.id);
          expect(res.body).toEqual(mockDeleteResult);
        })
    })

    it('Forbidden db didn\'t find those feet', () => {
      let mockID = 'mockID'
      return request(app.getHttpServer())
        .delete(`/feet/${mockID}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect((res: Response) => {
          expect(res.status).toEqual(403);
          expect(res.body).toEqual({ statusCode: 403, message: 'Forbidden resource', error: 'Forbidden' });
        })
    })
  })

  afterAll(async () => {
    await app.close();
  });
});