import { Test, TestingModule } from '@nestjs/testing';
import { FeetService } from './feet.service';
import { getRepositoryToken } from "@nestjs/typeorm";
import { Feet } from "./feet.entity";
import { FeetClass } from "../core/utility/feet.class";
import { FeetInterface } from "./feet.interface";
import {of, throwError} from "rxjs";
import {DeleteResult, Repository, UpdateResult} from "typeorm";
import { HttpException, HttpStatus } from "@nestjs/common";
import { UserClass } from "../core/utility/user.class";
import { UsersInterface } from "../users/users.interface";
import {FeetDto} from "./feet.dto";
import {CommentEntity} from "./comment.entity";
import {AdditionEntity} from "./addition.entity";
import {FileService} from "../file/file.service";
import {AdditionClass} from "../core/utility/addition.class";
import {AdditionInterface} from "./addition.interface";
import {NewsEntity} from "../news/news.entity";
import {createSocket} from "dgram";
import {CommentClass} from "../core/utility/comment.class";
import {CommentInterface} from "./comment.interface";
import {UsersDto} from "../users/users.dto";
import {AdditionDto} from "./addition.dto";

const mockFeetRepository = {
  save: jest.fn(),
  find: jest.fn(),
  delete: jest.fn(),
  update: jest.fn(),
  findOne: jest.fn(),
}

const mockCommentRepository = {
  save: jest.fn(),
  find: jest.fn(),
  delete: jest.fn(),
  update: jest.fn(),
  findOne: jest.fn(),
}

const mockAdditionRepository = {
  save: jest.fn(),
  find: jest.fn(),
  delete: jest.fn(),
  update: jest.fn(),
  findOne: jest.fn(),
}

const fileService = {
  removeFile: jest.fn(),
}

describe('FeetService', () => {
  let service: FeetService;
  let repositoryFeet: Repository<Feet>;
  let repositoryCommentEntity: Repository<CommentEntity>;
  let repositoryAdditionEntity: Repository<AdditionEntity>;

  let mockUser = UserClass as UsersInterface
  let mockFeet = FeetClass as FeetInterface;
  let mockAddition = AdditionClass as AdditionInterface;
  let mockComment = CommentClass as CommentInterface;

  let updateResult: UpdateResult = {generatedMaps: [], raw: [], affected: 1 } as UpdateResult;
  let mockDeleteResult: DeleteResult = {raw: [], affected: 1} as DeleteResult;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeetService,
        { provide: getRepositoryToken(Feet), useValue: mockFeetRepository },
        { provide: getRepositoryToken(CommentEntity), useValue: mockCommentRepository },
        { provide: getRepositoryToken(AdditionEntity), useValue: mockAdditionRepository },
        { provide: FileService, useValue: fileService },
      ],
    }).compile();

    service = module.get<FeetService>(FeetService);
    repositoryFeet = module.get<Repository<Feet>>(getRepositoryToken(Feet));
    repositoryCommentEntity = module.get<Repository<CommentEntity>>(getRepositoryToken(CommentEntity));
    repositoryAdditionEntity = module.get<Repository<AdditionEntity>>(getRepositoryToken(AdditionEntity));
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createFeet()', () => {
    it('create new feet', () => {
      let saveFeet = jest.spyOn(repositoryFeet, 'save').mockResolvedValue({...mockFeet, addition: mockAddition} as Feet);
      let findOneFeet = jest.spyOn(repositoryFeet, 'findOne').mockResolvedValue({...mockFeet, addition: mockAddition} as Feet);
      let saveAddition = jest.spyOn(repositoryAdditionEntity, 'save').mockResolvedValue(mockAddition as AdditionEntity);

      service.createFeet({...mockFeet, addition: mockAddition} as FeetDto).subscribe((feet: FeetInterface) => {
        expect(saveAddition).toHaveBeenCalledWith(mockAddition);
        expect(saveFeet).toHaveBeenCalledWith({...mockFeet, addition: mockAddition});
        expect(findOneFeet).toHaveBeenCalledWith({ where: { id: mockFeet.id }, relations: ['author', 'like', 'addition'] });
        expect(feet).toEqual({...mockFeet, addition: mockAddition});
      })
    })

    it('error when create feet', () => {
      let mockErr = new HttpException('Something went wrong when save feet', HttpStatus.BAD_REQUEST)
      let saveAddition = jest.spyOn(repositoryAdditionEntity, 'save').mockRejectedValue(throwError(() => mockErr));

      service.createFeet({...mockFeet, addition: mockAddition} as FeetDto).subscribe({
        error: (err) => {
          expect(saveAddition).toHaveBeenCalledWith(mockAddition);
        }
      })
    })
  })

  describe('updateFeet()', () => {
    it('should update feet', () => {
      let findOneFeet = jest.spyOn(repositoryFeet, 'findOne').mockResolvedValue(mockFeet as Feet);
      let saveAddition = jest.spyOn(repositoryAdditionEntity, 'save').mockResolvedValue(mockAddition as AdditionEntity);
      let saveFeet = jest.spyOn(repositoryFeet, 'save').mockResolvedValue(mockFeet as Feet);

      service.updateFeet({...mockFeet, addition: mockAddition}).subscribe((feet: FeetInterface | FeetDto) => {
        expect(feet).toEqual({ ...mockFeet, author: {}, comments: [] });
        expect(findOneFeet).toHaveBeenCalledWith({ where: { id: mockFeet.id } });
        expect(saveAddition).toHaveBeenCalledWith(mockAddition);
        expect(saveFeet).toHaveBeenCalledWith({ ...mockFeet, author: {}, comments: [] })
      })
    })
  })

  describe('getFeet()', () => {
    it('find one feet on id', () => {
      let findOneFeet = jest.spyOn(repositoryFeet, 'findOne').mockResolvedValue(mockFeet as Feet);
      let findFeet = jest.spyOn(repositoryCommentEntity, 'find').mockResolvedValue([] as CommentEntity[]);

      service.getFeet(mockFeet.id).subscribe((feet: FeetInterface) => {
        expect(feet).toEqual(mockFeet);
        expect(findOneFeet).toHaveBeenCalledWith({ where: { id: mockFeet.id }, relations: ['author', 'comments', 'addition', 'comments.host'] });
        expect(findFeet).toHaveBeenCalled();
      })
    })
    // it('db didn\'t find those feet.', () => {
    //   let mockErr = new HttpException('Something went wrong when save feet', HttpStatus.BAD_REQUEST)
    //   let findOneFeet = jest.spyOn(repositoryFeet, 'findOne').mockRejectedValue(throwError(() => mockErr));
    //
    //   service.getFeet(mockFeet.id).subscribe({
    //     error: (err) => {
    //       expect(findOneFeet).toHaveBeenCalled();
    //     }
    //   })
    // })
  })

  describe('getComment()', () => {
    it('should be return comment on property', () => {
      let findComment = jest.spyOn(repositoryCommentEntity, 'find').mockResolvedValue([mockComment] as CommentEntity[]);

      service.getComment({ id: mockComment.id, take: 1, skip: 0 }).subscribe((comment: CommentInterface[]) => {
        expect(comment).toEqual([mockComment]);
        expect(findComment).toHaveBeenCalled();
      })
    })
  })

  describe('allFeet()', () => {
    let propsFeet = {take: 1, skip: 0};

    it('find all feet on params', () => {
      let findFeet = jest.spyOn(repositoryFeet, 'find').mockResolvedValue([mockFeet] as Feet[]);

      service.allFeet(propsFeet).subscribe((feet: FeetInterface[]) => {
        expect(findFeet).toHaveBeenCalledWith({...propsFeet, order: { createdAt: 'DESC' }, relations: ['author', 'like']});
        expect(feet).toEqual([mockFeet]);
      })
    })

    it('db didn\'t not found feet.', () => {
      let mockErr = new HttpException('db didn\'t not found feet.', HttpStatus.NOT_FOUND)
      jest.spyOn(repositoryFeet, 'find').mockRejectedValue(throwError(() => mockErr));

      service.allFeet(propsFeet).subscribe({
        error: (err) => {
          expect({status: err.status, response: err.response}).toEqual({status: HttpStatus.NOT_FOUND, response: 'db didn\'t not found feet.'})
        }
      })
    })
  })

  describe('findFeetList()', () => {
    it('should be return feet array', () => {
      let findFeet = jest.spyOn(repositoryFeet, 'find').mockResolvedValue([{...mockFeet, like: [mockUser]}] as Feet[]);

      service.findFeetList({}, mockUser as UsersDto).subscribe((feet: FeetInterface[]) => {
        expect(feet).toEqual([{...mockFeet, like: [mockUser]}]);
        expect(findFeet).toHaveBeenCalledWith({ order: { createdAt: 'DESC' }, relations: ['author', 'like', 'addition']})
      })
    })

    it('db didn\'t not found feet.', () => {
      let mockErr = new HttpException('db didn\'t not found feet.', HttpStatus.NOT_FOUND);
      jest.spyOn(repositoryFeet, 'find').mockRejectedValue(throwError(() => mockErr));

      service.findFeetList({}, mockUser as UsersDto).subscribe({
        error: (err) => {
          expect({response: err.response, status: err.status}).toEqual({response: 'db didn\'t not found feet.', status: HttpStatus.NOT_FOUND})
        }
      })
    })
  })

  describe('likePost()', () => {
    it('should be return user like post', () => {
      let findOneFeet = jest.spyOn(repositoryFeet, 'findOne').mockResolvedValue({...mockFeet, author: mockUser, like: [mockUser]} as Feet);
      let saveFeet = jest.spyOn(repositoryFeet, 'save').mockResolvedValue(mockFeet as Feet);

      service.likePost(mockFeet.id, mockUser as UsersDto).subscribe((feet: FeetInterface) => {
        expect(feet).toEqual({...mockFeet,author: mockUser, like: [], like_count: 0});
        expect(findOneFeet).toHaveBeenCalledTimes(2);
        expect(saveFeet).toHaveBeenCalledTimes(2);
      })
    })
  })

  describe('commentCreate()', () => {
    it('should create comment', () => {
      let findOneFeet = jest.spyOn(repositoryFeet, 'findOne').mockResolvedValue(mockFeet as Feet);
      let saveComment = jest.spyOn(repositoryCommentEntity, 'save').mockResolvedValue(mockComment as CommentEntity);
      let findOneComment = jest.spyOn(repositoryCommentEntity, 'findOne').mockResolvedValue(mockComment as CommentEntity);

      service.commentCreate(mockFeet.id, mockComment, mockUser as  UsersDto).subscribe((comment: CommentInterface) => {
        expect(comment).toEqual(mockComment);
        expect(findOneFeet).toHaveBeenCalledWith({ where: { id: mockFeet.id }, relations: ['comments'] });
        expect(saveComment).toHaveBeenCalledWith({...mockComment, host: mockUser, feet: mockFeet});
      })
    })
  })

  describe('findOneFeet()', () => {
    it('should be find one feet on params', () => {
      let findOneFeet = jest.spyOn(repositoryFeet, 'findOne').mockResolvedValue(mockFeet as Feet);

      service.findOneFeet({where: { id: mockFeet.id }}).subscribe((feet: FeetInterface) => {
        expect(feet).toEqual(mockFeet);
        expect(findOneFeet).toHaveBeenCalledWith({where: { id: mockFeet.id }});
      })
    })
  })

  describe('findOneComment()', () => {
    it('should be return one comment on params', () => {
      let findOneComment = jest.spyOn(repositoryCommentEntity, 'findOne').mockResolvedValue(mockComment as CommentEntity);

      service.findOneComment({where: { id: mockComment.id }}).subscribe((comment: CommentInterface) => {
        expect(comment).toEqual(mockComment);
        expect(findOneComment).toHaveBeenCalledWith({where: { id: mockComment.id }});
      })
    })
  })

  describe('findComment()', () => {
    it('should be return comment array on params', () => {
      let findOneComment = jest.spyOn(repositoryCommentEntity, 'find').mockResolvedValue([mockComment] as CommentEntity[]);

      service.findComment({take: 1, skip: 0}).subscribe((comment: CommentInterface[]) => {
        expect(comment).toEqual([mockComment]);
        expect(findOneComment).toHaveBeenCalledWith({take: 1, skip: 0});
      })
    })
  })

  describe('findFeet()', () => {
    it('should return feet array on params', () => {
      let findFeet = jest.spyOn(repositoryFeet, 'find').mockResolvedValue([mockFeet] as Feet[]);

      service.findFeet({take: 1, skip: 0}).subscribe((feet: FeetInterface[]) => {
        expect(feet).toEqual([mockFeet]);
        expect(findFeet).toHaveBeenCalledWith({take: 1, skip: 0})
      })
    })
  })

  describe('deleteFeet()', () => {
    it('success be delete feet on id', () => {
      let findOneFeet = jest.spyOn(repositoryFeet, 'findOne').mockResolvedValue(mockFeet as Feet);
      let deleteFeet = jest.spyOn(repositoryFeet, 'delete').mockResolvedValue(mockDeleteResult);
      let removeFile = jest.spyOn(fileService, 'removeFile').mockImplementation(() => of(true))

      service.deleteFeet(mockFeet.id).subscribe((res: DeleteResult) => {
        expect(res).toEqual(mockDeleteResult);
        expect(findOneFeet).toHaveBeenCalledWith({ where: { id: mockFeet.id } });
        expect(deleteFeet).toHaveBeenCalledWith({ id: mockFeet.id });
        expect(removeFile).toHaveBeenCalledWith(mockFeet.img[0]);
      })
    })

    it('Something went wrong when delete feet.', () => {
      let mockErr = new HttpException('db didn\'t not found feet.', HttpStatus.NOT_FOUND);
      let findOneFeet = jest.spyOn(repositoryFeet, 'findOne').mockRejectedValue(mockErr)

      service.deleteFeet(mockFeet.id).subscribe({
        error: (err) => {
          expect({response: err.response, status: err.status}).toEqual({response: 'db didn\'t not found feet.', status: HttpStatus.NOT_FOUND});
          expect(findOneFeet).toHaveBeenCalled();
        }
      })
    })
  })

  describe('deleteComment()', () => {
    it('success be delete comment on id', () => {
      let findOneComment = jest.spyOn(repositoryCommentEntity, 'findOne').mockResolvedValue({...mockComment, host: mockUser} as CommentEntity);
      let deleteComment = jest.spyOn(repositoryCommentEntity, 'delete').mockResolvedValue(mockDeleteResult);

      service.deleteComment(mockComment.id, mockUser as UsersDto).subscribe((res: DeleteResult) => {
        expect(res).toEqual(mockDeleteResult);
        expect(findOneComment).toHaveBeenCalledWith({ where: { id: mockComment.id }, relations: ['host'] });
        expect(deleteComment).toHaveBeenCalledWith({ id: mockComment.id });
      })
    })

    it('something went wrong when delete comment.', () => {
      let mockErr = new HttpException('db didn\'t not found comment.', HttpStatus.NOT_FOUND);
      let findOneComment = jest.spyOn(repositoryCommentEntity, 'findOne').mockRejectedValue( mockErr );

      service.deleteComment(mockComment.id, mockUser as UsersDto).subscribe({
        error: (err) => {
          expect({ response: err.response, status: err.status }).toEqual({response: 'db didn\'t not found comment.', status: HttpStatus.NOT_FOUND});
          expect(findOneComment).toHaveBeenCalledWith({ where: { id: mockComment.id }, relations: ['host'] });
        }
      })
    })
  })

  describe('saveFeet()', () => {
    it('should be save feet', () => {
      let saveFeet = jest.spyOn(repositoryFeet, 'save').mockResolvedValue(mockFeet as Feet);

      service.saveFeet(mockFeet).subscribe((feet: FeetInterface | FeetDto) => {
        expect(feet).toEqual(mockFeet);
        expect(saveFeet).toHaveBeenCalledWith(mockFeet);
      })
    })
  })

  describe('saveComment()', () => {
    it('should be save comment', () => {
      let saveComment = jest.spyOn(repositoryCommentEntity, 'save').mockResolvedValue(mockComment as CommentEntity);

      service.saveComment(mockComment).subscribe((comment: CommentInterface) => {
        expect(comment).toEqual(mockComment);
        expect(saveComment).toHaveBeenCalledWith(mockComment);
      })
    })
  })

  describe('saveAddition()', () => {
    it('should be save addition', () => {
      let saveAddition = jest.spyOn(repositoryAdditionEntity, 'save').mockResolvedValue(mockAddition as AdditionEntity);

      service.saveAddition(mockAddition).subscribe((addition: AdditionDto | AdditionInterface) => {
        expect(addition).toEqual(mockAddition);
        expect(saveAddition).toHaveBeenCalledWith(mockAddition);
      })
    })
  })
});
