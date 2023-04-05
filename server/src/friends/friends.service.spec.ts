import { Test, TestingModule } from '@nestjs/testing';
import { FriendsService } from './friends.service';
import { UsersService } from "../users/users.service";
import { DeleteResult, Repository } from "typeorm";
import { FriendsEntity } from "./friends.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { of } from "rxjs";
import { UsersDto } from "../users/users.dto";
import { UserClass } from "../core/utility/user.class";
import { FriendCLass } from "../core/utility/friend.class";
import { FriendsInterface } from "./friends.interface";
import { UsersInterface } from "../users/users.interface";
import {ChatService} from "../chat/chat.service";
import {FriendsGateway} from "./friends.gateway";

let mockUsersService = {
  findOne: jest.fn(),
  saveUser: jest.fn().mockImplementation((data) => of(data)),
};

let mockFriendsEntity = {
  create: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
  delete: jest.fn(),
  save: jest.fn(),
}

let mockChatService = {

}

let mockFriendsGateway = {

}

describe('FriendsService', () => {
  let service: FriendsService;
  let usersService: UsersService;
  let chatService: ChatService;
  let friendsRepository: Repository<FriendsEntity>;

  let user = UserClass as UsersDto;
  let friend = FriendCLass;
  let myProfile = {...Object.assign(user), id: 'myID'};

  const mockDeleteResult: DeleteResult = {
    raw: [],
    affected: 1,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FriendsService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: getRepositoryToken(FriendsEntity), useValue: mockFriendsEntity },
        { provide: ChatService, useValue: mockChatService },
        { provide: FriendsGateway, useValue: mockFriendsGateway },
      ],
    }).compile();

    service = module.get<FriendsService>(FriendsService);
    usersService = module.get<UsersService>(UsersService);
    chatService = module.get<ChatService>(ChatService);
    friendsRepository = module.get<Repository<FriendsEntity>>(getRepositoryToken(FriendsEntity));
    jest.clearAllMocks();
  });

  it('should be defined FriendsService', () => {
    expect(service).toBeDefined();
  });

  it('should be defined FriendsEntity', () => {
    expect(friendsRepository).toBeDefined();
  });

  describe('findOneFriend()', () => {
    it('should return find one friend on params', () => {
      let findOne = jest.spyOn(friendsRepository, 'findOne').mockResolvedValue(friend as FriendsEntity);

      service.findOneFriend({ where: {id: friend.id} }).subscribe((res: FriendsInterface) => {
        expect(res).toEqual(friend);
        expect(findOne).toHaveBeenCalledWith({ where: {id: friend.id} });
      })
    })
  })

  describe('findAll()', () => {
    it('should return find array friend on params', () => {
      let find = jest.spyOn(friendsRepository, 'find').mockResolvedValue([friend] as FriendsEntity[]);

      service.findAll({}).subscribe((friends: FriendsEntity[]) => {
        expect(friends).toEqual([friend]);
        expect(find).toHaveBeenCalledWith({});
      })
    })
  })

});
