import { Test, TestingModule } from '@nestjs/testing';
import { FriendsController } from './friends.controller';
import { FriendsService } from "./friends.service";
import { Request } from 'express';
import { FriendsInterface } from "./friends.interface";
import { UsersInterface } from "../users/users.interface";
import { UsersDto } from "../users/users.dto";
import { DeleteResult } from "typeorm";
import {FriendsDto} from "./friends.dto";
import {of} from "rxjs";

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
  } as FriendsInterface | FriendsDto;

  const mockDeleteResult: DeleteResult = {
    raw: [],
    affected: 1,
  };

  let mocFriendsService = {
    friends: [] as FriendsInterface[],
    create: jest.fn(),
    suggest: jest.fn(),
    offer: jest.fn(),
    confirm: jest.fn(),
    cancel: jest.fn(),
    delFriend: jest.fn(),
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
    let create = jest.spyOn(mocFriendsService, 'create').mockImplementation(() => of(friends));

    controller.create(friends.id,{ user:  user }).subscribe((friend: FriendsInterface) => {
      expect(friend).toEqual(friends)
      expect(create).toHaveBeenCalledWith(friends.id, user);
    })
  })

  it('must receive all suggested from friends, suggest()', () => {
    let suggest = jest.spyOn(mocFriendsService, 'suggest').mockImplementation(() => of([friends]));

    controller.suggest({ user }).subscribe((friend: FriendsInterface[]) => {
      expect(friend).toEqual([friends]);
      expect(suggest).toHaveBeenCalledWith(user.id)
    })
  })

  it('should return all my friend offer, offer()', () => {
    let offer = jest.spyOn(mocFriendsService, 'offer').mockImplementation(() => of([friends]));

    controller.offer({ user }).subscribe((friend: FriendsInterface[]) => {
      expect(friend).toEqual([friends]);
      expect(offer).toHaveBeenCalledWith(user.id);
    })
  })

  it('accept offer in my friends ,confirm()', () => {
    let confirm = jest.spyOn(mocFriendsService, 'confirm').mockImplementation(() => of({user, friend: friends}));

    controller.confirm('requestID', { user }).subscribe((res: { user: UsersInterface, friend: UsersInterface }) => {
      expect(res).toEqual({user, friend: friends});
      expect(confirm).toHaveBeenCalledWith('requestID', user);
    })
  })

  it('cancel friend offer, cancel()', () => {
    let cancel = jest.spyOn(mocFriendsService, 'cancel').mockImplementation(() => of([friends]));

    controller.cancel('requestID', { user }).subscribe((res: FriendsInterface[] ) => {
      expect(res).toEqual([friends]);
      expect(cancel).toHaveBeenCalledWith('requestID', user);
    })
  })

  it('remove from friends ,delFriend()', () => {
    let delFriend = jest.spyOn(mocFriendsService, 'delFriend').mockImplementation(() => of([user]));

    controller.delFriend(friends.id, { user }).subscribe((res: UsersInterface[]) => {
      expect(res).toEqual([user]);
      expect(delFriend).toHaveBeenCalledWith(friends.id, user);
    })
  })
});
