import { Test, TestingModule } from '@nestjs/testing';
import { FriendsController } from './friends.controller';
import { FriendsService } from "./friends.service";
import { Request } from 'express';
import { FriendsInterface } from "./friends.interface";
import { UsersInterface } from "../users/users.interface";
import { UsersDto } from "../users/users.dto";

describe('FriendsController', () => {
  let controller: FriendsController;
  let friendsService: FriendsService;

  const request: Partial<Response> = {
    json: jest.fn().mockImplementation().mockReturnValue({name: 'test'}),
  }

  let user = {
    id: 'userID',
    firstName: 'FirstName',
    lastName: 'LastName',
    email: 'test@mail.com',
    avatar: 'MyAvatar',
    request: [] as FriendsInterface[],
    suggest: [] as FriendsInterface[],
    friends: [] as UsersInterface[],
    role: 'user',
    created_at: new Date(),
  } as UsersDto;

  let friends = {
    id: 'randomID',
    user: {} as UsersInterface,
    friends: {} as UsersInterface,
    status: 'pending',
    created_at: new Date(),
  } as FriendsInterface;

  let mocFriendsService = {
    friends: [] as FriendsInterface[],
    create: jest.fn().mockImplementation((friendsID: string, user: UsersDto ) => {
      let compileAsk = {...friends, user: user as UsersInterface, friends: {id: friendsID} as UsersInterface}
      mocFriendsService.friends.push(compileAsk);
      return compileAsk
    })
  }

  beforeEach(async () => {

    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [FriendsController],
      providers: [
        {provide: FriendsService, useValue: mocFriendsService}
      ]
    }).compile();

    controller = moduleRef.get<FriendsController>(FriendsController);
    friendsService = moduleRef.get<FriendsService>(FriendsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be success create friends, create()', () => {
    expect(controller.create('friendsID', {user} as Request)).toEqual({
      ...friends, user: user as UsersInterface, friends: {id: 'friendsID'} as UsersInterface
    })
  })



});
