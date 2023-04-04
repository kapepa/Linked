import { Test, TestingModule } from '@nestjs/testing';
import { FeetController } from './feet.controller';
import { FeetService } from "./feet.service";
import { JwtModule } from "@nestjs/jwt";
import { UserClass } from "../core/utility/user.class";
import { UsersDto } from "../users/users.dto";
import { FeetClass } from "../core/utility/feet.class";
import { FeetInterface } from "./feet.interface";
import {of, throwError} from "rxjs";
import { DeleteResult } from "typeorm";
import {FileService} from "../file/file.service";
import {FeetDto} from "./feet.dto";
import {HttpException, HttpStatus} from "@nestjs/common";

const mockFeetService = {
  createFeet: jest.fn(),
  getFeet: jest.fn(),
  allFeet: jest.fn(),
  updateFeet: jest.fn(),
  findFeetList: jest.fn(),
  deleteFeet: jest.fn(() => of({raw: [], affected: 1,} as DeleteResult)),
}

const mockFileService = {

}

describe('FeetController', () => {
  let controller: FeetController;

  let user = UserClass as UsersDto;
  let feet = FeetClass as FeetInterface;



  const mockDeleteResult: DeleteResult = {
    raw: [],
    affected: 1,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FeetController],
      providers: [
        { provide: FeetService, useValue: mockFeetService },
        { provide: FileService, useValue: mockFileService },
      ],
      imports: [JwtModule],
    }).compile();

    controller = module.get<FeetController>(FeetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create feet, createFeet()', () => {
    let body = feet.body;
    jest.spyOn(mockFeetService, 'createFeet').mockReturnValueOnce(of(feet));

    controller.createFeet({body}, {}, {user}).subscribe((mockFeet) => {
      expect(mockFeetService.createFeet).toHaveBeenCalledWith({body, author: user});
      expect(mockFeet).toEqual(feet);
    })
  })

  describe('getFeet()', () => {
    it('get feet on id)', () => {
      jest.spyOn(mockFeetService, 'getFeet').mockReturnValueOnce(of(feet));
      controller.getFeet(feet.id).subscribe((mockFeet: FeetInterface) => {
        expect(mockFeetService.getFeet).toHaveBeenCalledWith(feet.id);
        expect(mockFeet).toEqual(feet);
      })
    })

    it('server didn\'t get id feet', () => {
      controller.getFeet('').subscribe({
        error: (err) => {
          expect(err.response).toEqual('server didn\'t get id feet')
        }
      })
    })
  })

  it('get feet[], allFeet()', () => {
    let query = { take: 1, skip: 0 };
    let findFeetList = jest.spyOn(mockFeetService, 'findFeetList').mockReturnValueOnce(of([feet]));

    controller.allFeet(query.take, query.skip).subscribe((mockFeet: FeetInterface[] ) => {
      expect(findFeetList).toHaveBeenCalled();
      expect(mockFeet).toEqual([feet]);
    })
  })

  describe('updateFeet()', () => {
    let newBody = 'new body';

    it('success update feet', () => {
      jest.spyOn(mockFeetService, 'updateFeet').mockReturnValueOnce(of({...feet, body: newBody}));

      controller.updateFeet(feet.id, {}, {body: newBody} as FeetDto).subscribe((mockFeet: FeetInterface) => {
        expect(mockFeetService.updateFeet).toHaveBeenCalledWith( {body: newBody, id: "feetID"});
        expect(mockFeet).toEqual({...feet, body: newBody});
      })
    })

    it('Not Found data for update', () => {
      let exception = new HttpException('Not Found data for update', HttpStatus.NOT_FOUND);
      jest.spyOn(mockFeetService, 'updateFeet').mockReturnValue(throwError(() => exception));

      controller.updateFeet(feet.id, {}, {body: newBody} as FeetDto).subscribe({
        error: (err) => {
          expect({status: err.status, response: err.response}).toEqual({status: HttpStatus.NOT_FOUND, response: 'Not Found data for update'})
        }
      })
    })
  })

  describe('deleteFeet()', () => {
    it('delete feet on id, ', () => {
      controller.deleteFeet(feet.id).subscribe((del: DeleteResult) => {
        expect(mockFeetService.deleteFeet).toHaveBeenCalledWith(feet.id);
        expect(del).toEqual(mockDeleteResult);
      })
    })

    it('Not found feet for id', () => {
      controller.deleteFeet('').subscribe({
        error: (err) => {
          expect(err.response).toEqual('Not found feet for id');
        }
      })
    })
  })
});
