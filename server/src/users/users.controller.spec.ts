import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from "./users.service";
import { UserClass } from "../core/utility/user.class";
import { UsersDto } from "./users.dto";
import { of } from "rxjs";
import { UsersInterface } from "./users.interface";
import {UpdateResult} from "typeorm";

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  let user = UserClass as UsersDto;

  let updateResult = {generatedMaps: [], raw: [], affected: 1 } as UpdateResult;

  let mockUsersService = {
    avatarUser: jest.fn().mockImplementation((data) => of(data)),
    findOne: jest.fn().mockImplementation((data) => of(data)),
    person: jest.fn().mockImplementation((data) => of(data)),
    updateUser: jest.fn().mockImplementation((data) => of(updateResult)),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: mockUsersService }
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('set a new user avatar, avatarLoad()', async () => {
    const mockFile = {
      fieldname: 'file',
      originalname: 'face-14.jpg',
      encoding: '7bit',
      mimetype: 'image/jpg',
      buffer: Buffer.from('<Buffer ff d8 ff e0 00 10 4a 46 49 42>'),
      size: 51828,
    } as Express.Multer.File;

    controller.avatarLoad(mockFile, {user}).subscribe(() => {
      expect(mockUsersService.avatarUser).toHaveBeenCalledWith(mockFile, user)
    })
  })

  it('get own profile, getUser()', () => {
    jest.spyOn(mockUsersService, 'findOne').mockReturnValueOnce(of(user));

    controller.getUser({user}).subscribe((findUser: UsersInterface) => {
      expect(mockUsersService.findOne).toHaveBeenCalledWith('id', user.id, { relations: ['suggest', 'suggest.user'] });
      expect(findUser).toEqual(user);
    })
  })

  it('find user on id, receive his data and friends, person()', () => {
    jest.spyOn(mockUsersService, "person").mockReturnValueOnce(of(user));

    controller.person(user.id, {user}).subscribe((person: UsersInterface) => {
      expect(mockUsersService.person).toHaveBeenCalledWith(user.id, user);
      expect(person).toEqual(user);
    });
  })

  it('update own data, in profile', () => {
    let mockBody = {firstName: "BestName"};
    controller.update(mockBody, {user}).subscribe((res: UpdateResult) => {
      expect(mockUsersService.updateUser).toHaveBeenCalledWith('id', user.id, mockBody);
      expect(res).toEqual(updateResult);
    })
  })

});
