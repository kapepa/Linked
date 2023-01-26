import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import {getRepositoryToken} from "@nestjs/typeorm";
import {User} from "./users.entity";
import {AuthService} from "../auth/auth.service";
import {FileService} from "../file/file.service";
import {UserClass} from "../core/utility/user.class";
import {UsersDto} from "./users.dto";
import {of} from "rxjs";
import {UsersInterface} from "./users.interface";
import {UpdateResult} from "typeorm";

describe('UsersService', () => {
  let service: UsersService;
  let authService: AuthService;
  let fileService: FileService;
  let user = UserClass as UsersDto;

  let updateResult = {generatedMaps: [], raw: [], affected: 1 } as UpdateResult;

  let mockFile = {
    buffer: Buffer.from('12 3d'),
    fieldname: 'mock-file',
    originalname: 'mock-file',
    encoding: '7bit',
    mimetype: 'file-mimetyp',
    destination: 'destination-path',
    filename: 'file-name',
    path: 'file-path',
    size: 955578,
  } as Express.Multer.File

  let mockAuthService = {
    loginUser: jest.fn(),
  };

  let mockFileService = {
    formFile: jest.fn(),
    removeFile: jest.fn(() => of({}))
  }

  let mockUserEntity = {
    findOne: jest.fn(),
    update: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: AuthService, useValue: mockAuthService },
        { provide: FileService, useValue: mockFileService },
        { provide: getRepositoryToken(User), useValue: mockUserEntity },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    authService = module.get<AuthService>(AuthService);
    fileService = module.get<FileService>(FileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('find user, findOne()', () => {
    jest.spyOn(mockUserEntity, 'findOne').mockReturnValueOnce(of(user));

    service.findOne('id', user.id ).subscribe((profile: UsersInterface) => {
      expect(mockUserEntity.findOne).toHaveBeenCalledWith({ where: { id: user.id }});
      expect(profile).toEqual(user);
    })
  })

  it('update user, updateUser()', () => {
    jest.spyOn(mockUserEntity, 'update').mockReturnValueOnce(of(updateResult));

    service.updateUser('id', user.id, {firstName: "BestName"}).subscribe((res: UpdateResult) => {
      expect(mockUserEntity.update).toHaveBeenCalledWith({ id: user.id }, {firstName: "BestName"});
      expect(res).toEqual(updateResult);
    })
  })

  it('exist user, existUser()', () => {
    jest.spyOn(mockUserEntity, 'findOne').mockReturnValueOnce(of(user));

    service.existUser('id', user.id).subscribe((bol: boolean) => {
      expect(mockUserEntity.findOne).toHaveBeenCalledWith({ where:{ 'id': user.id } });
      expect(bol).toBeTruthy();
    })
  })

  it('save user, saveUser()', () => {
    jest.spyOn(mockUserEntity, 'save').mockReturnValueOnce(of(user));

    service.saveUser(user).subscribe((profile: UsersInterface) => {
      expect(mockUserEntity.save).toHaveBeenCalledWith(user);
      expect(profile).toEqual(user);
    })
  })

  describe('person()', () => {
    let person = { ...user, id: 'personID', friends: [user] };
    let different = { ...user, id: 'differentID', friends: [user] };

    jest.spyOn(mockUserEntity, 'findOne').mockReturnValue(of({...person, friends: [user, different]}));

    it('receive profile with request, friends, suggest', () => {
      service.person(person.id, user).subscribe((profile: UsersInterface) => {
        expect(mockUserEntity.findOne).toHaveBeenCalledWith(
          {
            where: {id: person.id},
            relations: ['request', 'friends', 'suggest', 'suggest.user', 'suggest.friends', 'request.user', 'request.friends'],
          });
        expect(profile).toEqual({...person, friends: [user]});
      })
    })
  })

  describe('avatarUser()', () => {
    let token = {access_token: 'some_token'};
    jest.spyOn(mockUserEntity, 'update').mockReturnValue(of(updateResult));
    jest.spyOn(mockAuthService, 'loginUser').mockReturnValue(of(token));

    it('load avatar user success', () => {
      jest.spyOn(mockFileService, 'formFile').mockReturnValueOnce(of(true));

      service.avatarUser(mockFile, user).subscribe((newToken: {access_token: string}) => {
        expect(mockFileService.formFile).toHaveBeenCalledWith(mockFile.filename);
        expect(mockFileService.removeFile).toHaveBeenCalledWith(user.avatar);
        expect(newToken).toEqual(token);
      })
    })

    it('Your avatar has not been saved',() => {
      jest.spyOn(mockFileService, 'formFile').mockReturnValueOnce(of(false))

      service.avatarUser(mockFile, user).subscribe({
        error: (err) => {
          expect(mockFileService.formFile).toHaveBeenCalledWith(mockFile.filename);
          expect(err.response).toEqual('Your avatar has not been saved');
        }
      })
    })
  })

});
