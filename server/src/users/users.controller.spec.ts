import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from "./users.service";
import { UserClass } from "../core/utility/user.class";
import { UsersDto } from "./users.dto";
import { of } from "rxjs";
import { UsersInterface } from "./users.interface";
import {DeleteResult, UpdateResult} from "typeorm";
import {JwtService} from "@nestjs/jwt";
import { config } from "dotenv";

config();

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  let user = UserClass as UsersDto;
  let updateResult = {generatedMaps: [], raw: [], affected: 1 } as UpdateResult;
  let deleteResult: DeleteResult = {raw: [], affected: 1};

  let mockToken = new JwtService({secret: process.env.JWT_SECRET}).sign(
    {firstName: user.firstName, lastName: user.lastName, id: user.id, role: user.role, avatar: user.avatar}
  )

  let mockUsersService = {
    avatarUser: jest.fn(),
    findOne: jest.fn(),
    person: jest.fn(),
    recommendedUsers: jest.fn(),
    updateUser: jest.fn(),
    del: jest.fn(),
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

  describe('avatarLoad()', () => {
    it('set a new user avatar,', async () => {
      let mockFile = {
        fieldname: 'file',
        originalname: 'face-14.jpg',
        encoding: '7bit',
        mimetype: 'image/jpg',
        buffer: Buffer.from('<Buffer ff d8 ff e0 00 10 4a 46 49 42>'),
        size: 51828,
      } as Express.Multer.File;
      let avatarUser = jest.spyOn(mockUsersService, 'avatarUser').mockImplementation(() => of({access_token: mockToken}))

      controller.avatarLoad(mockFile, {user}).subscribe((res: {access_token: string}) => {
        expect(res).toEqual({access_token: mockToken});
        expect(mockUsersService.avatarUser).toHaveBeenCalledWith(mockFile, user);
      })
    })
  })

  describe('getUser()', () => {
    it('get own profile, getUser()', () => {
      let findOne = jest.spyOn(mockUsersService, 'findOne').mockImplementation(() => of(user));

      controller.getUser({user}).subscribe((findUser: UsersInterface) => {
        expect(findOne).toHaveBeenCalledWith('id', user.id, { relations: ['suggest', 'suggest.user'] });
        expect(findUser).toEqual(user);
      })
    })
  })

  describe('person()', () => {
    it('find user on id, receive his data and friends, person()', () => {
      let personOne = jest.spyOn(mockUsersService, "person").mockImplementation(() => of(user));

      controller.person(user.id, {user}).subscribe((person: UsersInterface) => {
        expect(personOne).toHaveBeenCalledWith(user.id, user);
        expect(person).toEqual(user);
      });
    })
  })

  describe('recommended()', () => {
    it('should be returned users which recommended', () => {
      let mockUsers = [{...user, id: 'personID'}];
      let recommendedUsers = jest.spyOn(mockUsersService, 'recommendedUsers').mockImplementation(() => of(mockUsers));

      controller.recommended({user}).subscribe((users: UsersInterface[]) => {
        expect(users).toEqual(mockUsers);
        expect(recommendedUsers).toHaveBeenCalledWith(user);
      })
    })
  })

  describe('update()', () => {
    it('should be update user', () => {
      let body = { firstName: 'Update Name' }
      let updateUser = jest.spyOn(mockUsersService, 'updateUser').mockImplementation(() => of(updateResult));

      controller.update(body, {user}).subscribe((res: UpdateResult) => {
        expect(res).toEqual(updateResult);
        expect(updateUser).toHaveBeenCalledWith('id', user.id, body);
      })
    })
  })

  describe('del()', () => {
    it('should be delete  user on id', () => {
      let del = jest.spyOn(mockUsersService, 'del').mockImplementation(() => of(deleteResult));

      controller.del(user.id).subscribe((res) => {
        expect(res).toEqual(deleteResult);
        expect(del).toHaveBeenCalledWith(user.id)
      })
    })
  })
});
