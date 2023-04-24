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
import {ChatService} from "../chat/chat.service";
import {FriendsGateway} from "./friends.gateway";
import {ChatInterface} from "../chat/chat.interface";
import {ChatClass} from "../core/utility/chat.class";
import {UsersInterface} from "../users/users.interface";

let mockUsersService = {
  findOne: jest.fn(),
  saveUser: jest.fn(),
  findOneUser: jest.fn(),
};

let mockFriendsEntity = {
  create: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
  delete: jest.fn(),
  save: jest.fn(),
}

let mockChatService = {
  createChat: jest.fn(),
  saveChat: jest.fn(),
  deleteChat: jest.fn(),
  findOneChat: jest.fn(),
  deleteChatAndMessage: jest.fn(),
}

let mockFriendsGateway = {
  notificationAddFriend: jest.fn(),
  changeFriendSuggest: jest.fn(),
  declineFriend: jest.fn(),
  deleteFriendSuggest: jest.fn(),
}

describe('FriendsService', () => {
  let service: FriendsService;
  let usersService: UsersService;
  let chatService: ChatService;
  let friendsRepository: Repository<FriendsEntity>;

  let user = UserClass as UsersDto;
  let friend = FriendCLass;
  let chatClass: ChatInterface = ChatClass as ChatInterface;

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

  describe('create()', () => {
    it('should be create friend', () => {
      let findOneUser = jest.spyOn(mockUsersService, 'findOneUser').mockImplementation(() => of({...friend, friends: [{...user, id: 'id'}]}));
      let save = jest.spyOn(friendsRepository, 'save').mockResolvedValue({ ...friend, user, friends: {...user, id: 'myFriendID'} } as FriendsEntity);
      let notificationAddFriend = jest.spyOn(mockFriendsGateway, 'notificationAddFriend');

      service.create(friend.id, user).subscribe((friends: FriendsInterface) => {
        expect(friends).toEqual({ id: 'friendID', user, friends: { ...user, id: 'myFriendID' }, status: 'pending' });
        expect(findOneUser).toHaveBeenCalledTimes(2);
        expect(save).toHaveBeenCalled();
        expect(notificationAddFriend).toHaveBeenCalledWith('friendID', 'userID');
      })
    })
  })

  describe('suggest()', () => {
    it('should be return suggest invite to be friends', () => {
      let findOne = jest.spyOn(mockUsersService, 'findOne').mockImplementation(
        () => of({...user, request: [{...friend, user: {...user, id: 'friendID'}}]})
      );

      service.suggest(user.id).subscribe((friends: FriendsInterface[]) => {
        expect(friends).toEqual([{id: 'friendID',user: { id: 'friendID' },friends: {},status: 'pending'}]);
        expect(findOne).toHaveBeenCalledWith('id', user.id, { relations: ['request', 'request.user'] })
      })
    })
  })

  describe('confirm()', () => {
    it('should be return friends who confirmed', () => {
      let mockFriend = {...friend, user, friends: {...user, id: 'opponentID'}} as FriendsInterface;
      let findOne = jest.spyOn(mockFriendsEntity, 'findOne').mockResolvedValue(mockFriend);
      let createChat = jest.spyOn(mockChatService, 'createChat').mockImplementation(() => of(chatClass));
      let saveUser = jest.spyOn(mockUsersService, 'saveUser').mockImplementation(() => of(user));
      let saveChat = jest.spyOn(mockChatService, 'saveChat').mockImplementation(() => of(chatClass));
      let deleteRequest = jest.spyOn(mockFriendsEntity, 'delete').mockResolvedValue(mockDeleteResult);
      let changeFriendSuggest = jest.spyOn(mockFriendsGateway, 'changeFriendSuggest')

      service.confirm('friendID', user).subscribe((res: { user: UsersInterface, friend: UsersInterface } ) => {
        expect(res).toEqual(expect.not.objectContaining({...friend, user, friends: {...user, id: 'opponentID'}}));
        expect(findOne).toHaveBeenCalledWith({
          where: { user : { id: 'friendID' }, friends: { id: user.id }},
          relations: ['user', 'user.friends', 'user.chat',  'user.request', 'friends', 'friends.friends', 'friends.chat', 'friends.suggest',]
        })
        expect(createChat).toHaveBeenCalled();
        // expect(saveUser).toHaveBeenCalled();
        expect(saveChat).toHaveBeenCalled();
        expect(deleteRequest).toHaveBeenCalledWith({id: friend.id});
        expect(changeFriendSuggest).toHaveBeenCalledWith(user.id, 'opponentID');
      })
    })
  })

  describe('offer()', () => {
    it('should be return all list with requests on friends', () => {
      let findOne = jest.spyOn(mockUsersService, 'findOne').mockImplementation(() => of({...user, request: [friend]}));

      service.offer(user.id).subscribe((request: FriendsInterface[]) => {
        expect(request).toEqual([friend]);
        expect(findOne).toHaveBeenCalledWith('id', user.id ,{relations: ['request']});
      })
    })
  })

  describe('cancel()', () => {
    it('should be delete my own friend, and return new list friends', () => {
      let findOne = jest.spyOn(mockFriendsEntity, 'findOne').mockResolvedValue({...friend, user});
      let deleteOne = jest.spyOn(mockFriendsEntity, 'delete').mockResolvedValue(mockDeleteResult);
      // let deleteChat = jest.spyOn(mockChatService, 'deleteChat').mockImplementation(() => of(mockDeleteResult));
      let declineFriend = jest.spyOn(mockFriendsGateway, 'declineFriend');

      service.cancel(friend.id, user).subscribe((friends: FriendsInterface[]) => {
        expect(friends).toEqual([]);
        expect(findOne).toHaveBeenCalledWith({where: {id: friend.id}, relations: ['user', 'friends']});
        expect(deleteOne).toHaveBeenCalledWith({ id: friend.id });
        // expect(deleteChat).toHaveBeenCalledWith(user.id, friend.id);
        expect(declineFriend).toHaveBeenCalled();
      })
    })
  })

  describe('delFriend()', () => {
    it('should be delete my own friend, and return new array with my friends', () => {
      let findOneUser = jest.spyOn(mockUsersService, 'findOneUser').mockImplementation(() => of({ ...user, id: 'friendID',  friends: [user], chat: chatClass }))
      let deleteChatAndMessage = jest.spyOn(mockChatService, 'deleteChatAndMessage').mockImplementation(() => of(mockDeleteResult));
      let saveUser = jest.spyOn(mockUsersService, 'saveUser').mockImplementation(() => of(user));
      let deleteFriendSuggest = jest.spyOn(mockFriendsGateway, 'deleteFriendSuggest');

      service.delFriend('friendID', user).subscribe((friends: UsersInterface[]) => {
        expect(findOneUser).toHaveBeenCalledWith({where: {id: 'friendID', chat: {conversation: {id: user.id}} }, relations: ['friends', 'chat']})
        expect(deleteChatAndMessage).toHaveBeenCalled();
        expect(saveUser).toHaveBeenCalledTimes(1);
        expect(deleteFriendSuggest).toHaveBeenCalled()
      })
    })
  })

  describe('deleteRequest()', () => {
    it('should be delete friend on id', () => {
      let deleteOne = jest.spyOn(mockFriendsEntity, 'delete').mockResolvedValue(mockDeleteResult);

      service.deleteRequest(friend.id).subscribe((res: DeleteResult) => {
        expect(res).toEqual(mockDeleteResult);
        expect(deleteOne).toHaveBeenCalledWith({id: friend.id});
      })
    })
  })
});
