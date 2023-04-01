import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import {ForbiddenException, HttpException, HttpStatus, INestApplication} from '@nestjs/common';
import { FeetService } from "../src/feet/feet.service";
import { AppModule } from "../src/app.module";
import { UserClass } from "../src/core/utility/user.class";
import { UsersDto } from "../src/users/users.dto";
import {FeetClass} from "../src/core/utility/feet.class";
import {FeetInterface} from "../src/feet/feet.interface";
import {catchError, from, of, tap} from "rxjs";
import { config } from "dotenv";
import {FeetDto} from "../src/feet/feet.dto";
import {DeleteResult} from "typeorm";
import {JwtService} from "@nestjs/jwt";
import {FileService} from "../src/file/file.service";

config();

describe('Feet (e2e)', () => {
  let app: INestApplication;
  let mockUser = UserClass as UsersDto;
  let mockFeet = FeetClass as FeetInterface;
  let mockDeleteResult: DeleteResult = {raw: [], affected: 1,};
  let authToken = new JwtService(
    {secret: process.env.JWT_SECRET}
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
    findFeetList: jest.fn(),
    getFeet: jest.fn(),
    createFeet: jest.fn(),
    updateFeet: jest.fn(),
    allFeet: jest.fn(),
    deleteFeet: jest.fn()
  };

  let mockFileService = {
    formFile: jest.fn(),
  }


  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(FeetService)
      .useValue(mockFeetService)
      .overrideProvider(FileService)
      .useValue(mockFileService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  describe('/POST feet/create', () => {
    it(`success create feet`, () => {
      jest.spyOn(mockFeetService, 'createFeet').mockImplementation(() => of( {...mockFeet, author: mockUser} ))

      return request(app.getHttpServer())
        .post('/feet/create')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(201)
        .send({ body: mockFeet.body } )
        .expect((res: Response) => {
          expect(res.body).toEqual({...mockFeet, author: mockUser});
        });
    });
  })


  describe('/GET feet/:id', () => {
    it('should return feet on id', () => {
      jest.spyOn(mockFeetService, 'getFeet').mockImplementation(() => of(mockFeet));

      return request(app.getHttpServer())
        .get(`/feet/one/${mockFeet.id}`)
        .expect((res: Response) => {
          expect(res.status).toEqual(200);
          expect(res.body).toEqual(mockFeet);
        })
    });
  })

  describe('/GET feet', () => {
    it('should return FeetInterface[] on query params', () => {
      let findFeetList = jest.spyOn(mockFeetService, 'findFeetList').mockImplementation(() => (of([FeetClass])))

      return request(app.getHttpServer())
        .get('/feet?take=1&skip=0&word=')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res: Response & {body: FeetInterface[]}) => {
          expect(findFeetList).toHaveBeenCalledWith({ take: 1, skip: 0, }, {avatar: UserClass.avatar, firstName: UserClass.firstName, lastName: UserClass.lastName, id: UserClass.id, role: UserClass.role});
          expect(res.body).toEqual([FeetClass]);
        })
    })
  })

  describe('/PATCH feet/update/:id', () => {
    let mockBody = 'Update feet';

    it('should success update feet and return current feet', () => {
      let mockFeet = FeetClass
      let createFeet = jest.spyOn(mockFeetService, 'updateFeet').mockImplementation( () => of(mockFeet));
      jest.spyOn(mockFeetService, 'allFeet').mockImplementation(() => of([mockFeet]));
      jest.spyOn(mockFileService, 'formFile').mockImplementation(() => of({}));

      return request(app.getHttpServer())
        .patch(`/feet/update/${mockFeet.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({body: mockBody})
        .expect(200)
        .expect((res: Response & {body: FeetInterface}) => {
          expect(createFeet).toHaveBeenCalled();
        })
    })
  })

  describe('/DELETE feet/:id', () => {
    it('should success delete feet on id', () => {
      let deleteFeet = jest.spyOn(mockFeetService, 'deleteFeet').mockImplementation(() => of(mockDeleteResult))
      jest.spyOn(mockFeetService, 'allFeet').mockImplementation(() => of([mockFeet]));

      return request(app.getHttpServer())
        .delete(`/feet/${mockFeet.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res: Response) => {
          expect(deleteFeet).toHaveBeenCalledWith(mockFeet.id);
        })
    })
  })
});