import { Test, TestingModule } from '@nestjs/testing';
import { FeetService } from './feet.service';
import { getRepositoryToken } from "@nestjs/typeorm";
import { Feet } from "./feet.entity";
import { FeetClass } from "../core/utility/feet.class";
import { FeetInterface } from "./feet.interface";
import { of} from "rxjs";
import {DeleteResult, UpdateResult} from "typeorm";
import { HttpException, HttpStatus } from "@nestjs/common";
import { UserClass } from "../core/utility/user.class";
import { UsersInterface } from "../users/users.interface";
import {FeetDto} from "./feet.dto";

describe('FeetService', () => {
  let service: FeetService;

  let mockUser = UserClass as UsersInterface
  let mockFeet = FeetClass as FeetInterface;

  let updateResult = {generatedMaps: [], raw: [], affected: 1 } as UpdateResult;
  let mockDeleteResult: DeleteResult = {raw: [], affected: 1,};

  let feetRepository = {
    save: jest.fn(),
    find: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
    findOne: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeetService,
        { provide: getRepositoryToken(Feet), useValue: feetRepository },
      ],
    }).compile();

    service = module.get<FeetService>(FeetService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createFeet()', () => {
    it('create new feet', () => {
      jest.spyOn(feetRepository, 'save').mockImplementationOnce(() => of(mockFeet));

      service.createFeet({body: mockFeet.body} as FeetDto).subscribe((feet: FeetInterface) => {
        expect(feetRepository.save).toHaveBeenCalledWith({body: mockFeet.body});
        expect(feet).toEqual(mockFeet);
      })
    })

    it('error when create feet', () => {
      let mockErr = new HttpException('Something went wrong when save feet', HttpStatus.BAD_REQUEST)
      jest.spyOn(feetRepository, 'save').mockReturnValueOnce(of(mockErr));

      service.createFeet({body: mockFeet.body} as FeetDto).subscribe({
        error: (err) => {
          expect(err).toThrowError(mockErr);
        }
      })
    })
  })

  describe('getFeet()', () => {
    it('find one feet on id', () => {
      jest.spyOn(feetRepository, 'findOne').mockReturnValueOnce(of(mockFeet));

      service.getFeet(mockFeet.id).subscribe((feet: FeetInterface) => {
        expect(feetRepository.findOne).toHaveBeenCalledWith({ where: { id: mockFeet.id } });
        expect(feet).toEqual(mockFeet);
      })
    })

    it('db didn\'t find those feet.', () => {
      jest.spyOn(feetRepository, 'findOne').mockRejectedValueOnce(new Error('Mock error'));

      service.getFeet(mockFeet.id).subscribe({
        error: (err) => {
          expect(err.response).toEqual('db didn\'t find those feet.');
        }
      })
    })
  })

  describe('allFeet()', () => {
    let propsFeet = {take: 1, skip: 0};

    it('find all feet on params', () => {
      jest.spyOn(feetRepository, 'find').mockReturnValueOnce(of([{...mockFeet, author: mockUser}]));

      service.allFeet(propsFeet).subscribe((feets: FeetInterface[]) => {
        expect(feetRepository.find).toHaveBeenCalledWith({...propsFeet, order: { createdAt: 'DESC' }, relations: ['author']});
        expect(feets).toEqual([{...mockFeet, author: mockUser}]);
      })
    })

    it('db didn\'t not found feet.', () => {
      jest.spyOn(feetRepository, 'find').mockRejectedValueOnce(new Error('Mock err'));

      service.allFeet(propsFeet).subscribe({
        error: (err) => {
          expect(err.response).toEqual('db didn\'t not found feet.');
        }
      })
    })
  })

  describe('updateFeet()', () => {
    let mockBody = 'new body';

    it('success update feet on id', () => {
      jest.spyOn(feetRepository, 'update').mockReturnValueOnce(of(updateResult));
      jest.spyOn(feetRepository, 'findOne').mockReturnValueOnce(of({...mockFeet, body: mockBody}));

      service.updateFeet({body: mockBody}).subscribe((feet: FeetInterface) => {
        expect(feetRepository.update).toHaveBeenCalledWith({ id: mockFeet.id }, {body: mockBody});
        expect(feet).toEqual({...mockFeet, body: mockBody});
      })
    })

    it('Something went wrong when update feet.', () => {
      jest.spyOn(feetRepository, 'update').mockRejectedValueOnce(new Error('Mock err'));

      service.updateFeet({body: mockBody}).subscribe({
        error: (err) => {
          expect(err.response).toEqual('Something went wrong when update feet.');
        }
      })
    })
  })

  describe('deleteFeet()', () => {
    it('success delete feet on id', () => {
      jest.spyOn(feetRepository, 'delete').mockReturnValueOnce(of(mockDeleteResult));

      service.deleteFeet(mockFeet.id).subscribe((res: DeleteResult) => {
        expect(feetRepository.delete).toHaveBeenCalledWith({ id: mockFeet.id });
        expect(res).toEqual(mockDeleteResult);
      })
    })

    it('Something went wrong when delete feet.', () => {
      jest.spyOn(feetRepository, 'delete').mockRejectedValueOnce(new Error('Mock err'));

      service.deleteFeet(mockFeet.id).subscribe({
        error: (err) => {
          expect(err.response).toEqual('Something went wrong when delete feet.')
        }
      })
    })
  })
});
