import { Test, TestingModule } from '@nestjs/testing';
import { FriendsService } from './friends.service';
import { UsersService } from "../users/users.service";
import {DeleteResult, Repository} from "typeorm";
import { FriendsEntity } from "./friends.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { of } from "rxjs";
import { UsersDto } from "../users/users.dto";
import { UserClass } from "../core/utility/user.class";
import {FriendCLass} from "../core/utility/friend.class";
import {FriendsInterface} from "./friends.interface";
import {UsersInterface} from "../users/users.interface";

describe('FriendsService', () => {
  let service: FriendsService;
  let usersService: UsersService;
  let friendsRepository: Repository<FriendsEntity>;

  let user = UserClass as UsersDto;
  let friend = FriendCLass;
  let myProfile = {...Object.assign(user), id: 'myID'};

  const mockDeleteResult: DeleteResult = {
    raw: [],
    affected: 1,
  };

  let mockUsersService = {
    findOne: jest.fn(),
    saveUser: jest.fn().mockImplementation((data) => of(data)),
  };

  let mockFriendsEntity = {
    create: jest.fn(),
    findOne: jest.fn().mockImplementation((data) => of(data)),
    find: jest.fn().mockImplementation((data) => of(data)),
    delete: jest.fn().mockImplementation(() => of(mockDeleteResult)),
    save: jest.fn().mockImplementation((data) => of(data)),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FriendsService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: getRepositoryToken(FriendsEntity), useValue: mockFriendsEntity }
      ],
    }).compile();

    service = module.get<FriendsService>(FriendsService);
    usersService = module.get<UsersService>(UsersService);
    friendsRepository = module.get<Repository<FriendsEntity>>(getRepositoryToken(FriendsEntity));
    jest.clearAllMocks();
  });

  it('should be defined FriendsService', () => {
    expect(service).toBeDefined();
  });

  it('should be defined FriendsEntity', () => {
    expect(friendsRepository).toBeDefined();
  });

  it('find one friend on attributes, findOne()',() => {
    let props = { where: { id: 'friendID' } };

    service.findOne(props).subscribe((friend) => {
      expect(friendsRepository.findOne).toHaveBeenCalledWith(props);
    });
  })

  it('find all friend on parameters, findAll()', () => {
    let props = { where: { status: 'pending' } };

    service.findAll(props).subscribe(() => {
      expect(friendsRepository.find).toHaveBeenCalledWith(props);
    });
  })

  it('create new friend, create()', () => {
    let friendsID = 'friendID';
    jest.spyOn(mockUsersService, 'findOne').mockImplementation(() => of({...user, id: friendsID}));
    jest.spyOn(mockFriendsEntity, 'findOne').mockImplementation(() => of(undefined));

    service.create(friendsID, user).subscribe(() => {
      expect(usersService.findOne).toHaveBeenCalledWith('id', friendsID);
      expect(friendsRepository.findOne).toHaveBeenCalledWith({where: { 'friends': {'id': friendsID} }, relations: ['friends'] });
      expect(friendsRepository.save).toHaveBeenCalledWith({ user, friends: {...user, id: friendsID} });
    });
  })

  it('receive all suggest on friend, suggest()', () => {
    jest.spyOn(mockUsersService, 'findOne').mockImplementationOnce(() =>
      of({...user, request: [{...friend, user: {...user, id: 'profileID'}}]})
    );

    service.suggest(user.id).subscribe((friends: FriendsInterface[]) => {
      expect(usersService.findOne).toHaveBeenCalledWith('id', user.id, { relations: ['request', 'request.user'] });
      expect(friends).toEqual([{...friend, user: { id: 'profileID' }}])
    });
  })

  it('confirmed assumption of friendship, confirm()', () => {
    jest.spyOn(mockUsersService, 'findOne').mockImplementationOnce(() => of(myProfile));
    jest.spyOn(mockUsersService, 'findOne').mockImplementationOnce(() => of({...user, friends: []}));
    jest.spyOn(mockUsersService, 'findOne').mockImplementationOnce(() => of(user));
    jest.spyOn(mockFriendsEntity, 'findOne').mockImplementationOnce(() =>
      of({...friend, user, friends: myProfile })
    );

    service.confirm(friend.id, myProfile).subscribe((profile: UsersInterface) => {
      expect(usersService.findOne).toHaveBeenCalledWith('id', myProfile.id, { relations: ['friends'] });
      expect(friendsRepository.findOne).toHaveBeenCalledWith({where: {id: friend.id}, relations: ['user', 'friends']});
      expect(usersService.findOne).toHaveBeenCalledWith('id', user.id, { relations: ['friends'] });
      expect(friendsRepository.delete).toHaveBeenCalledWith({id: friend.id});
      expect(profile).toEqual({...user, friends: [ {id: myProfile.id} ]});
    })
  })

  it('receive all request to add to friends, offer()', () => {
    jest.spyOn(mockUsersService,'findOne').mockImplementationOnce(() => of(user));

    service.offer(user).subscribe((request: FriendsInterface[]) => {
      expect(mockUsersService.findOne).toHaveBeenCalledWith('id', user.id ,{ relations: ['request']});
      expect(request).toEqual(user.request);
    })
  })

  it('cancel offer add as friend, cancel()', () => {
    jest.spyOn(mockFriendsEntity, 'findOne').mockImplementationOnce(() => of({...friend, user, friends: myProfile}));

    service.cancel(friend.id, myProfile).subscribe((delRes: DeleteResult) => {
      expect(friendsRepository.findOne).toHaveBeenCalledWith({where: {id: friend.id}, relations: ['user', 'friends']});
      expect(friendsRepository.delete).toHaveBeenCalledWith({id: friend.id});
      expect(delRes).toEqual(mockDeleteResult);
    })
  })

  it('/delete user from friends, delFriend()', () => {
    jest.spyOn(mockUsersService,'findOne').mockImplementationOnce(() => of({...user, friends: [myProfile]}));
    jest.spyOn(mockUsersService,'findOne').mockImplementationOnce(() => of({...myProfile, friends: [user]}));

    service.delFriend(user.id, myProfile).subscribe((users: UsersInterface[]) => {
      expect(mockUsersService.findOne).toHaveBeenCalledWith('id', user.id, { relations: ['friends'] });
      expect(mockUsersService.findOne).toHaveBeenCalledWith('id', myProfile.id, { relations: ['friends'] });
    })
  })

  it('/delete friends from repository, deleteRequest()', () => {
    service.deleteRequest('requestID').subscribe((delRes: DeleteResult) => {
      expect(friendsRepository.delete).toHaveBeenCalledWith({id: 'requestID'});
      expect(delRes).toEqual(mockDeleteResult);
    })
  })
});
