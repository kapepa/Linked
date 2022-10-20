import { Test, TestingModule } from '@nestjs/testing';
import { FriendsController } from './friends.controller';
import { FriendsService } from "./friends.service";
import { Request } from 'express';
import { FriendsInterface } from "./friends.interface";
import { UsersInterface } from "../users/users.interface";
import { UsersDto } from "../users/users.dto";
import { DeleteResult } from "typeorm";

describe('FriendsController', () => {
  let controller: FriendsController;
  let friendsService: FriendsService;

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

  const mockDeleteResult: DeleteResult = {
    raw: [],
    affected: 1,
  };

  let mocFriendsService = {
    friends: [] as FriendsInterface[],
    create: jest.fn().mockImplementation((friendsID: string, user: UsersDto ) => {
      let compileAsk = {...friends, user: user as UsersInterface, friends: {id: friendsID} as UsersInterface}
      mocFriendsService.friends.push(compileAsk);
      return compileAsk
    }),
    suggest: jest.fn().mockImplementation((userID: string) => {
      friends.user = { id: 'friendID' } as UsersInterface;
      user.suggest.push(friends);
      return user.suggest;
    }),
    offer: jest.fn().mockImplementation(( user: UsersDto ) => {
      user.request.push(friends);
      return user.request;
    }),
    confirm: jest.fn().mockImplementation((requestID: string, user: UsersDto ) => {
      let friend = Object.assign(user, {id: 'friendID', firstName: 'friendName', friends: [user]} as UsersInterface);
      user.friends.push(friend);
      return Object.assign(user, {id: 'friendID', firstName: 'friendName', friends: [user]} as UsersInterface);
    }),
    cancel: jest.fn().mockImplementation((friendID: string, user: UsersDto) => {
      return mockDeleteResult;
    }),
    delFriend: jest.fn().mockImplementation((friendID: string, user: UsersDto) => {
      return mockDeleteResult;
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

  it('must receive all suggested from friends, suggest()', () => {
    expect(controller.suggest({user} as Request)).toEqual([{...friends, user: { id: 'friendID' }}]);
  })

  it('should return all my friend offer, offer()', () => {
    expect(controller.offer({user} as Request)).toEqual([friends])
  })

  it('accept offer in my friends ,confirm()', () => {
    expect(controller.confirm('requestID', {user} as Request)).toEqual(Object.assign(user, {id: 'friendID', firstName: 'friendName', friends: [user]} as UsersInterface));
    expect(user.friends).toEqual([Object.assign(user, {id: 'friendID', firstName: 'friendName', friends: [user]} as UsersInterface)])
  })

  it('cancel friend offer, cancel()', () => {
    expect(controller.cancel('requestID', {user} as Request)).toEqual(mockDeleteResult);
  })

  it('remove from friends ,delFriend()', () => {
    expect(controller.delFriend('friendID', {user} as Request)).toEqual(mockDeleteResult);
  })

});
