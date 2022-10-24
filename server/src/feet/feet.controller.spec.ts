import { Test, TestingModule } from '@nestjs/testing';
import { FeetController } from './feet.controller';
import { FeetService } from "./feet.service";
import { JwtModule } from "@nestjs/jwt";
import { UserClass } from "../core/utility/user.class";
import { UsersDto } from "../users/users.dto";
import { FeetClass } from "../core/utility/feet.class";
import { FeetInterface } from "./feet.interface";
import { of } from "rxjs";
import { DeleteResult } from "typeorm";

describe('FeetController', () => {
  let controller: FeetController;

  let user = UserClass as UsersDto;
  let feet = FeetClass as FeetInterface;

  const mockDeleteResult: DeleteResult = {
    raw: [],
    affected: 1,
  };

  let mockFeetService = {
    createFeet: jest.fn(),
    getFeet: jest.fn(),
    allFeet: jest.fn(),
    updateFeet: jest.fn(),
    deleteFeet: jest.fn(() => of(mockDeleteResult)),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FeetController],
      providers: [
        { provide: FeetService, useValue: mockFeetService },
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

    controller.createFeet({body}, {user}).subscribe((mockFeet) => {
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
    jest.spyOn(mockFeetService, 'allFeet').mockReturnValueOnce(of([feet]));

    controller.allFeet(query.take, query.skip).subscribe((mockFeet: FeetInterface[] ) => {
      expect(mockFeetService.allFeet).toHaveBeenCalledWith(query);
      expect(mockFeet).toEqual([feet]);
    })
  })

  describe('updateFeet()', () => {
    it('success update feet', () => {
      let newBody = 'new body';
      jest.spyOn(mockFeetService, 'updateFeet').mockReturnValueOnce(of({...feet, body: newBody}));

      controller.updateFeet(feet.id, {body: newBody}).subscribe((mockFeet: FeetInterface) => {
        expect(mockFeetService.updateFeet).toHaveBeenCalledWith(feet.id, {body: newBody});
        expect(mockFeet).toEqual({...feet, body: newBody});
      })
    })

    it('Not Found data for update', () => {
      controller.updateFeet(feet.id, {}).subscribe({
        error: (err) => {
          expect(err.response).toEqual('Not Found data for update.');
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
