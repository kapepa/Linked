import {Test, TestingModule} from '@nestjs/testing';
import {ChatService} from './chat.service';
import {ChatGateway} from "./chat.gateway";
import {UsersService} from "../users/users.service";
import {DeleteResult, Repository, UpdateResult} from "typeorm";
import {Chat} from "./chat.entity";
import {getRepositoryToken} from "@nestjs/typeorm";
import {MessageEntity} from "./message.entity";
import {OptionInterface} from "../core/interface/option.interface";
import {UserClass} from "../core/utility/user.class";
import {ChatClass, MessageClass} from "../core/utility/chat.class";
import {from, Observable, of} from "rxjs";
import {ChatInterface} from "./chat.interface";
import {MessageInterface} from "./message.interface";
import {UsersDto} from "../users/users.dto";
import {UsersInterface} from "../users/users.interface";
import {MessageStatus} from "./status.enum";
import {MessageDto} from "./message.dto";

const MockChatGateway = {
  deleteMessage: jest.fn(),
  newMessage: jest.fn(),
}

const MockUsersService = {
  findOneUser: jest.fn(),
}

const MockChat = {
  findOne: jest.fn(),
  find: jest.fn(),
  delete: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
}

const MockMessage = {
  findOne: jest.fn(),
  find: jest.fn(),
  delete: jest.fn(),
  update: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
}

describe('ChatService', () => {
  let service: ChatService;
  let usersService: UsersService;
  let chatGateway: ChatGateway;
  let chatRepository: Repository<Chat>;
  let messageRepository: Repository<MessageEntity>;

  let userClass = UserClass;
  let chatClass = ChatClass;
  let messageClass = MessageClass;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        { provide: UsersService, useValue: MockUsersService },
        { provide: ChatGateway, useValue: MockChatGateway },
        { provide: getRepositoryToken(Chat), useValue: MockChat },
        { provide: getRepositoryToken(MessageEntity), useValue: MockMessage },
      ],
    }).compile();

    service = module.get<ChatService>(ChatService);
    usersService = module.get<UsersService>(UsersService);
    chatGateway = module.get<ChatGateway>(ChatGateway);
    chatRepository = module.get<Repository<Chat>>(getRepositoryToken(Chat));
    messageRepository = module.get<Repository<MessageEntity>>(getRepositoryToken(MessageEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findOneChat', () => {
    let options: OptionInterface = { where: {id: chatClass.id} };
    let mockChat = chatClass as ChatInterface;
    let spyFindOne = jest.spyOn(chatRepository, 'findOne').mockResolvedValue(mockChat as Chat)

    service.findOneChat(options).subscribe({
      next: (chat: ChatInterface) => {
        expect(chat as ChatInterface).toEqual(mockChat);
        expect(spyFindOne).toHaveBeenCalledWith(options);
      }
    })
  })

  it('findChat', () => {
    let options: OptionInterface = { skip: 0, take: 1 };
    let mockChat = [chatClass] as ChatInterface[];
    let spyFrom = jest.spyOn(chatRepository, 'find').mockResolvedValue( mockChat as Chat[] );

    service.findChat(options).subscribe({
      next: (chat: ChatInterface[]) => {
        expect(chat).toEqual(mockChat);
        expect(spyFrom).toHaveBeenCalledWith(options);
      }
    })
  })

  it('findMessage', () => {
    let options: OptionInterface = { skip: 0, take: 1 };
    let mockMessage: MessageInterface[] = [MessageClass] as MessageInterface[];
    let spyFind = jest.spyOn(messageRepository, 'find').mockResolvedValue(mockMessage as MessageEntity[]);

    service.findMessage(options).subscribe({
      next: (message: MessageInterface[]) => {
        expect(message).toEqual(mockMessage);
        expect(spyFind).toHaveBeenCalledWith(options);
      }
    })
  })

  it('deleteMessage', () => {
    let mockID = messageClass.id;
    let deleteResult: DeleteResult = { raw: 'success', affected: 200 };
    let mockDelete = jest.spyOn(messageRepository, 'delete').mockResolvedValue(deleteResult);

    service.deleteMessage(mockID).subscribe({
      next: (res: DeleteResult) => {
        expect(res).toEqual(deleteResult);
        expect(mockDelete).toHaveBeenCalledWith({id: mockID});
      }
    })
  })

  // it('deleteMessageOnID', () => {
  //   let mockChat: ChatInterface = ChatClass as ChatInterface;
  //   let mockMessage: MessageInterface = messageClass as MessageInterface;
  //   let mockUser = userClass as UsersDto;
  //   let deleteResult: DeleteResult = { raw: 'success', affected: 200 };
  //   let spyMessageDelete = jest.spyOn(messageRepository, 'delete').mockResolvedValue(deleteResult);
  //   let spyDeleteMessage = jest.spyOn(chatGateway, 'deleteMessage');
  //
  //   service.deleteMessageOnID(mockChat.id, mockMessage.id, mockUser).subscribe({
  //     next: (res: DeleteResult) => {
  //       expect(res).toEqual(deleteResult);
  //       expect(spyMessageDelete).toHaveBeenCalledWith({id: mockMessage.id});
  //       expect(spyDeleteMessage).toHaveBeenCalledWith(mockChat.id, mockMessage.id, mockUser.id)
  //     }
  //   })
  // })

  it('deleteChatAndMessage', () => {
    let mockChat: ChatInterface = ChatClass as ChatInterface;
    let deleteResult: DeleteResult = { raw: 'success', affected: 200 };
    let spyMessageDelete = jest.spyOn(messageRepository, 'delete').mockResolvedValue(deleteResult);
    let spyChatDelete = jest.spyOn(chatRepository, 'delete').mockResolvedValue(deleteResult);

    service.deleteChatAndMessage(mockChat).subscribe({
      next: (res: DeleteResult) => {
        expect(res).toEqual(deleteResult);
        expect(spyMessageDelete).toHaveBeenCalledWith({ chat: {id: mockChat.id }});
        expect(spyChatDelete).toHaveBeenCalledWith({id: mockChat.id})
      }
    })
  })

  describe('conversation', () => {
    let mockChat: ChatInterface = {...ChatClass, conversation: [{...userClass, id: 'fakeID'}]} as ChatInterface;
    let mockMessage: MessageInterface = MessageClass as MessageInterface;
    let mockQuery: {skip?: number, take?: number, first?: string} = {skip: 0, take: 1}

    it('should return no have friends', () => {
      let mockUser = userClass as UsersInterface;
      let spyUsersFind = jest.spyOn(usersService, 'findOneUser').mockImplementation(
        (option: OptionInterface): Observable<UsersInterface> => of({...mockUser, friends: []}));

      service.conversation(userClass as UsersDto, mockQuery).subscribe({
        next: (res: { friends: UsersInterface[], chat: ChatInterface, no: { read: string[] } }) => {
          expect(res).toEqual({ friends: [], chat: {} , no: { read: [] } });
          expect(spyUsersFind).toHaveBeenCalled();
        }
      })
    })

    it('should return sort conversation', () => {
      let mockUser = {...userClass, chat: [mockChat], friends: [userClass] } as UsersInterface;
      let spyChatFind = jest.spyOn(chatRepository, 'find').mockResolvedValue([mockChat] as Chat[]);
      let spyMessageFind = jest.spyOn(messageRepository, 'find').mockResolvedValue([mockMessage] as MessageEntity[]);
      let spyMessageUpdate = jest.spyOn(messageRepository, 'update');
      let spyUsersFind = jest.spyOn(usersService, 'findOneUser').mockImplementation(
        (option: OptionInterface): Observable<UsersInterface> => of(mockUser));

      service.conversation(userClass as UsersDto, mockQuery).subscribe({
        next: (res: { friends: UsersInterface[], chat: ChatInterface, no: { read: string[] } }) => {
          expect(res).toEqual({friends: [{...userClass, id: 'fakeID'}], chat: mockChat, no: { read: [ 'fakeID' ] }} )
          expect(spyChatFind).toHaveBeenCalledTimes(2);
          expect(spyMessageFind).toHaveBeenCalledWith({where: { chat: { id: mockChat.id} }, order: { created_at: "DESC" }, relations: [ 'owner', 'chat' ], take: 20, skip: 0,});
          expect(spyMessageUpdate).toHaveBeenCalled();
          expect(spyUsersFind).toHaveBeenCalledWith({ where: { id: mockUser.id }, relations: ['chat', 'chat.chat', 'chat.conversation', 'chat.chat.owner', 'friends'], order: { chat: { updated_at: "ASC" } },})}
      })
    })
  })

  it('companion', () => {
    let mockUser = userClass as UsersInterface;
    let spyFindUser = jest.spyOn(usersService, 'findOneUser').mockReturnValue(of(mockUser));

    service.companion(mockUser.id).subscribe({
      next: (user: UsersInterface) => {
        expect(user).toEqual(mockUser);
        expect(spyFindUser).toHaveBeenCalledWith({ where: { id: mockUser.id } });
      }
    })
  })

  it('createChat', () => {
    let mockChat: ChatInterface = ChatClass as ChatInterface;
    let spyChatSave = jest.spyOn(chatRepository, 'save').mockResolvedValue(mockChat as Chat);
    let spyChatFindOne = jest.spyOn(chatRepository, 'findOne').mockResolvedValue({...mockChat, conversation: []} as Chat);

    service.createChat().subscribe({
      next: (chat: ChatInterface) => {
        expect(chat).toEqual({ ...mockChat, conversation: [] });
        expect(spyChatSave).toHaveBeenCalledWith({});
        expect(spyChatFindOne).toHaveBeenCalledWith({ where: { id: mockChat.id }, relations: ['conversation'] })
      }
    })
  })

  it('saveChat', () => {
    let mockChat: ChatInterface = ChatClass as ChatInterface;
    let spyChatSave = jest.spyOn(chatRepository, 'save').mockResolvedValue(mockChat as Chat);

    service.saveChat(mockChat).subscribe({
      next: (chat: ChatInterface) => {
        expect(chat).toEqual(mockChat);
        expect(spyChatSave).toHaveBeenCalledWith(mockChat);
      }
    })

  })

  it('deleteChat', () => {
    let userID = 'userID';
    let friendID = 'friendID';
    let mockChat: ChatInterface = ChatClass as ChatInterface;
    let deleteResult: DeleteResult = {raw: 'delete', affected: 200};
    let spyChatFindOne = jest.spyOn(chatRepository, 'findOne').mockResolvedValue(mockChat as Chat);
    let spyMessageRemove = jest.spyOn(messageRepository, 'remove').mockResolvedValue({} as MessageEntity);
    let spyChatDelete = jest.spyOn(chatRepository, 'delete').mockResolvedValue(deleteResult);

    service.deleteChat(userID, friendID).subscribe({
      next: (res: DeleteResult) => {
        expect(res).toEqual(deleteResult);
        expect(spyChatFindOne).toHaveBeenCalledWith({where: { conversation: [ {id: userID}, {id: friendID} ] }, relations: ['chat'] });
        expect(spyMessageRemove).toHaveBeenCalledWith(mockChat.chat);
        expect(spyChatDelete).toHaveBeenCalledWith({id: mockChat.id})
      }
    })
  })

  it('createMessage', () => {
    let mockChat: ChatInterface = {...ChatClass, conversation: [{...UserClass, id: 'fakeID'}, UserClass]} as ChatInterface;
    let mockMessage: MessageInterface = MessageClass as MessageInterface;
    let mockFindOneChat = jest.spyOn(chatRepository, 'findOne').mockResolvedValue(mockChat as Chat);
    let mockMessageSave = jest.spyOn(messageRepository, 'save').mockResolvedValue(mockMessage as MessageEntity);
    let mockChatSave = jest.spyOn(chatRepository, 'save').mockResolvedValue(mockChat as Chat);
    let mockGatewayNewMessage = jest.spyOn(chatGateway, 'newMessage')

    service.createMessage(mockChat.id, MessageClass as MessageDto, UserClass as UsersDto).subscribe({
      next: (message: MessageInterface) => {
        expect(message).toEqual(mockMessage);
        expect(mockFindOneChat).toHaveBeenCalledWith({ where: { id: mockChat.id }, relations: ['chat', 'conversation'] });
        expect(mockMessageSave).toHaveBeenCalledWith({...MessageClass, owner: UserClass});
        expect(mockChatSave).toHaveBeenCalledWith({ ...mockChat, chat: mockChat.chat.concat(message),  updated_at: expect.any( Date )});
        expect(mockGatewayNewMessage).toHaveBeenCalledWith('fakeID', UserClass.id, mockChat.id, mockMessage);
      }
    })
  })

  it('statusMessage', () => {
    let spyMessageUpdate = jest.spyOn(messageRepository, 'update').mockResolvedValue({} as UpdateResult);

    service.statusMessage(chatClass.id).subscribe({
      next: (res: Promise<UpdateResult>) => {
        expect(res).toBeTruthy();
        expect(spyMessageUpdate).toHaveBeenCalledWith({ chat: { id: chatClass.id }, status: MessageStatus.WAITING }, {status: MessageStatus.READING})
      }
    })
  })

  it('removeChat', async () => {
    let mockChat: ChatInterface = ChatClass as ChatInterface;
    let spyChatRemove = jest.spyOn(chatRepository, 'remove').mockReturnValue({} as any);
    await service.removeChat([mockChat]);

    expect(spyChatRemove).toHaveBeenCalledWith([mockChat]);
  })
});
