import {TestBed} from '@angular/core/testing';
import {ChatService} from './chat.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {HttpService} from "./http.service";
import {ChatClass} from "../../../utils/chat-class";
import {MessageClass} from "../../../utils/message-class";
import {HttpClient} from "@angular/common/http";
import {UserClass} from "../../../utils/user-class";
import {UserInterface} from "../interface/user.interface";
import {ChatInterface} from "../interface/chat.interface";
import {MessageInterface} from "../interface/message.interface";

describe('ChatService', () => {
  let service: ChatService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  let userClass = UserClass;
  let chatClass = ChatClass;
  let messageClass = MessageClass;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [
        ChatService,
        { provide: HttpService, useValue: { handleError: () => {} } }
      ]
    });
    service = TestBed.inject(ChatService);
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('should prepare new message for socket if reading. newMessageSocket', () => {
    let dto: { friend: {id: string}, chat: {id: string}, message: MessageInterface} =
      { friend: { id: userClass.id as string }, chat: { id: ChatClass.id }, message: messageClass as MessageInterface };

    beforeEach(() => {
      service.setChat = chatClass as ChatInterface;
    })

    it('should be reading message', () => {
      service.newMessageSocket(dto);
      service.getChat.subscribe({
        next: (chat: ChatInterface) => {
          expect(chat).toEqual(ChatClass as ChatInterface)
        }
      })
    })

    it('should be no reading message', () => {
      service.newMessageSocket({...dto, chat: {id: 'fackeID'}  });
      service.getNoRead.subscribe({
        next: (bool: boolean) => expect(bool).toBeTruthy(),
      })
      service.getNoReadFriend.subscribe({
        next: (friends: string[]) => expect(friends).toEqual([userClass.id as string]),
      })
    })
  })

  it('should delete message. deleteMessageSocket', () => {
    service.setChat = chatClass as ChatInterface;

    service.deleteMessageSocket(messageClass.id);
    service.getChat.subscribe({
      next: (chat: ChatInterface) => expect(chat.chat).toEqual([]),
    })
  })

  it('should be receive message. messageReceive', () => {
    let mockMessage = { ...messageClass, chat: {} } as MessageInterface
    service.setChat = { ...chatClass, chat: [] as MessageInterface[] } as ChatInterface;
    service.setFriends = [userClass as UserInterface];
    service.setActiveFriend = 0

    service.messageReceive(mockMessage);
    service.getChat.subscribe((chat: ChatInterface) => {
      expect(chat.chat).toEqual([mockMessage])
    })
  })

  it('setFriends and getFriends', () => {
    let friendsMoc = [userClass] as UserInterface[];
    service.setFriends = friendsMoc;

    service.getFriends.subscribe((friends: UserInterface[]) => {
      expect(friends).toEqual(friendsMoc);
    })
  })

  it('setChat and getChat', () => {
    let chatMock = chatClass as ChatInterface;
    service.setChat = chatMock;

    service.getChat.subscribe((chat: ChatInterface) => {
      expect(chat).toEqual(chatMock);
    })
  })

  it('setActiveConversation and getActiveConversation', () => {
    let idMock = chatClass.id;
    service.setActiveConversation = idMock;

    service.getActiveConversation.subscribe((id: string) => {
      expect(id).toEqual(idMock);
    })
  })

  it('setNoReadMessage and getNoRead', () => {
    service.setNoReadMessage = true;

    service.getNoRead.subscribe((bool: boolean) => {
      expect(bool).toBeTruthy();
    })
  })

  it('setNoReadFriend and getNoReadFriend', () => {
    let stringMock = ['stringMock'] as string[];
    service.setNoReadFriend = stringMock;

    service.getNoReadFriend.subscribe((str: string[]) => {
      expect(str).toEqual(stringMock);
    })
  })

  it('setChatLoad and getChatLoad', () => {
    let boolMock = true;
    service.setChatLoad = boolMock;

    service.getChatLoad.subscribe((bool: boolean) => {
      expect(bool).toBeTruthy();
    })
  })

});
