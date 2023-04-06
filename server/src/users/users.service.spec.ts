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
import { config } from "dotenv";
import {JwtService} from "@nestjs/jwt";

config();

describe('UsersService', () => {
  let service: UsersService;
  let authService: AuthService;
  let fileService: FileService;
  let user = UserClass as UsersDto;

  let updateResult = {generatedMaps: [], raw: [], affected: 1 } as UpdateResult;

  let toke = new JwtService({secret: process.env.JWT_SECRET}).sign(
    {firstName: user.firstName, lastName: user.lastName, id: user.id, role: user.role, avatar: user.avatar}
  )

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
    it('load avatar user success', () => {
      let mockToken = {access_token: toke};
      let formFile = jest.spyOn(mockFileService, 'formFile').mockImplementation(() => of(true));
      let findOne = jest.spyOn(mockUserEntity, 'findOne').mockResolvedValue({...user, avatar: ''});
      let saveUser = jest.spyOn(mockUserEntity, 'save').mockResolvedValue(user);
      let loginUser = jest.spyOn(mockAuthService, 'loginUser').mockImplementation(() => of(mockToken));

      service.avatarUser(mockFile, user).subscribe((res: {access_token: string}) => {
        expect(formFile).toHaveBeenCalledWith(mockFile.filename);
        expect(findOne).toHaveBeenCalledWith({ where: { id: user.id }});
        expect(saveUser).toHaveBeenCalledWith({...user, avatar: mockFile.filename});
        expect(loginUser).toHaveBeenCalledTimes(1);
        expect(res).toEqual(mockToken);
      })
    })
  })
});
