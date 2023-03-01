import {TestBed} from '@angular/core/testing';
import {ChatService} from './chat.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {HttpService} from "./http.service";
import {ChatClass} from "../../../utils/chat-class";
import {MessageClass} from "../../../utils/message-class";
import {HttpClient, HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {UserClass} from "../../../utils/user-class";
import {UserInterface} from "../interface/user.interface";
import {ChatInterface} from "../interface/chat.interface";
import {MessageInterface} from "../interface/message.interface";
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";

import {FriendsInterface} from "../interface/friends.interface";
import {Observable} from "rxjs";
import {asyncError} from "../../../testing/async-observable-helpers";

describe('ChatService', () => {
  let service: ChatService;
  let httpService: HttpService;
  let httpTestingController: HttpTestingController;

  let userClass = UserClass;
  let chatClass = ChatClass;
  let messageClass = MessageClass;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [
        ChatService,
        { provide: HttpService, useValue: { handleError: (err: HttpErrorResponse) => {} } },
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    });

    service = TestBed.inject(ChatService);
    httpTestingController = TestBed.inject(HttpTestingController);
    httpService = TestBed.inject(HttpService) as jasmine.SpyObj<HttpService>;
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

  describe('delete message. deleteMessage', () => {
    const mockIndex = 0;
    const mockMessage = messageClass as MessageInterface;

    beforeEach(() => {
      service.setChat = chatClass as ChatInterface;
    })

    it('should be success delete message', (done: DoneFn) => {
      const response = new HttpResponse({ status: 200 });

      service.deleteMessage(mockIndex, mockMessage).subscribe({
        next: () => {
          service.getChat.subscribe({
            next: (chat: ChatInterface) => {
              expect(chat.chat?.length).toEqual(0);
              done()
            },
          })
        },
        error: err => done.fail,
      });

      const req = httpTestingController.expectOne(`${service.configUrl}/api/chat/messages?chat=${chatClass.id}&message=${mockMessage.id}`);
      expect(req.request.method).toEqual('DELETE');
      req.flush(response)
    })

    it('should be error', (done: DoneFn) => {
      const errorEvent = new ProgressEvent('error');
      const response = new HttpErrorResponse({ status: 404, statusText: 'Not Found' })
      spyOn(httpService, 'handleError').and.returnValue(asyncError(response));

      service.deleteMessage(mockIndex, mockMessage).subscribe({
        next: () => done.fail,
        error: (err: HttpErrorResponse) => {
          expect(err).toEqual(response);
          done();
        },
      });

      const req = httpTestingController.expectOne(`${service.configUrl}/api/chat/messages?chat=${chatClass.id}&message=${mockMessage.id}`);
      req.error(errorEvent);
    })
  })

  describe("requestChat", () => {
    const mockID: string = ChatClass.id;
    const mockParams: { take?: number, skip?: number } = { take: 1, skip: 0 };
    const mockChat = ChatClass as ChatInterface;

    it('should be receive array chat on params', (done: DoneFn) => {
      service.requestChat(mockID,mockParams).subscribe({
        next: (chat: ChatInterface) => {
          expect(chat).toEqual(mockChat)
          done();
        },
        error: () => done.fail,
      })

      const req = httpTestingController.expectOne(`${service.configUrl}/api/chat/one/${mockID}?take=${mockParams.take}&skip=${mockParams.skip}`);
      expect(req.request.method).toEqual('GET');
      req.flush(mockChat);
    })

    it('should be error, not found', (done: DoneFn) => {
      const errorEvent = new ProgressEvent('error');
      const response = new HttpErrorResponse({ status: 404, statusText: 'Not Found' });
      spyOn(httpService, 'handleError').and.returnValue(asyncError(response));

      service.requestChat(mockID, mockParams).subscribe({
        next: () => done.fail,
        error: (err: HttpErrorResponse) => {
          expect(err).toEqual(response);
          done();
        }
      })

      const req = httpTestingController.expectOne(`${service.configUrl}/api/chat/one/${mockID}?take=${mockParams.take}&skip=${mockParams.skip}`);
      req.error(errorEvent)
    })
  })

  describe("receiveAllConversation", () => {
    const mockQuery: {skip?: number, take?: number, first?: string} = {skip: 0, take: 1}
    const mockResponse: { friends: UserInterface[], chat: ChatInterface, no: { read: string[] }} =
      { friends: [UserClass] as UserInterface[], chat: ChatClass as ChatInterface, no: { read: [] as string[] }  }

    it('should be success receive conversation', (done: DoneFn) => {
      service.receiveAllConversation(mockQuery).subscribe({
        next: ( res: { friends: UserInterface[], chat: ChatInterface, no: { read: string[] } }) => {
          expect(res).toEqual(mockResponse);
          done();
        },
        error: () => done.fail,
      });

      const req = httpTestingController.expectOne(`${service.configUrl}/api/chat/conversation?skip=${mockQuery.skip}&take=${mockQuery.take}`);
      expect(req.request.method).toEqual('GET');
      req.flush(mockResponse);
    })

    it('should be return error not found', (done: DoneFn) => {
      const errorResponse = new HttpErrorResponse({ status: 404, statusText: 'Not Found' });
      spyOn(httpService, 'handleError').and.returnValue(asyncError(errorResponse));

      service.receiveAllConversation(mockQuery).subscribe({
        next: () => done.fail,
        error: (err: HttpErrorResponse) => {
          expect(err).toEqual(errorResponse);
          done();
        }
      })

      const req = httpTestingController.expectOne(`${service.configUrl}/api/chat/conversation?skip=${mockQuery.skip}&take=${mockQuery.take}`);
      req.error( new ProgressEvent('error'))
    })
  })

  describe('getCompanion', () => {
    const mockID: string = UserClass.id as string;
    const mockUser = UserClass as UserInterface;

    it('should return user on id', (done: DoneFn) => {
      service.getCompanion({id: mockID}).subscribe({
        next: (res: UserInterface) => {
          expect(mockUser).toEqual(res);
          done();
        },
        error: () => done.fail,
      })

      const req = httpTestingController.expectOne(`${service.configUrl}/api/chat/companion?id=${mockID}`);
      expect(req.request.method).toEqual('GET');
      req.flush(mockUser);
    })

    it("should be return error not found", (done: DoneFn) => {
      const errorResponse = new HttpErrorResponse({ status: 404, statusText: 'Not Found' });
      spyOn(httpService, 'handleError').and.returnValue(asyncError(errorResponse));

      service.getCompanion({id: mockID}).subscribe({
        next: () => done.fail,
        error: (err: HttpErrorResponse) => {
          expect(err).toEqual(errorResponse);
          done();
        }
      })

      const req = httpTestingController.expectOne(`${service.configUrl}/api/chat/companion?id=${mockID}`);
      req.error(new ProgressEvent('error'));
    })
  })

  describe('loadMessage', () => {

    beforeEach(() => {
      service.setChat = {...ChatClass, chat: []} as ChatInterface;
    })

    it('load message from chat', (done: DoneFn) => {
      const resMock: { messages: MessageInterface[]; limited: boolean } = { messages: [MessageClass as MessageInterface], limited: false };

      service.loadMessage().subscribe({
        next: (res: { messages: MessageInterface[]; limited: boolean }) => {
          expect(res).toEqual(resMock);
          done();
        },
        error: () => done.fail,
      })

      const req = httpTestingController.expectOne(`${service.configUrl}/api/chat/messages?id=${chatClass.id}&take=${20}&skip=${0}`);
      expect(req.request.method).toEqual('GET');
      req.flush(resMock);
    })

    it('should be return error not found messages', (done: DoneFn) => {
      const errorResponse = new HttpErrorResponse({ status: 404, statusText: 'Not Found' });
      spyOn(httpService, 'handleError').and.returnValue(asyncError(errorResponse));

      service.loadMessage().subscribe({
        next: () => done.fail,
        error: (err: HttpErrorResponse) => {
          expect(err).toEqual(errorResponse);
          done();
        }
      })

      const req = httpTestingController.expectOne(`${service.configUrl}/api/chat/messages?id=${chatClass.id}&take=${20}&skip=${0}`);
      req.error(new ProgressEvent('error'));
    })
  })

  describe("changeActiveConversation", () => {
    const mockID = 'fakeID';
    const mockIndex = 0;
    const mockChat = chatClass as ChatInterface;

    beforeEach(() => {
      service.setChat = mockChat;
    })

    it("should be success change active conversation", (done: DoneFn) => {
      service.changeActiveConversation(mockID, mockIndex).subscribe({
        next: (chat: ChatInterface) => {
          expect(chat).toEqual(mockChat)
          done();
        },
        error: () => done.fail,
      })

      const req = httpTestingController.expectOne(`${service.configUrl}/api/chat/change/${mockID}`);
      expect(req.request.method).toEqual('GET');
      req.event(new HttpResponse({status: 200, body: mockChat }))
    })

    it('should be return error not found chat', (done: DoneFn) => {
      const errorResponse = new HttpErrorResponse({ status: 404, statusText: 'Not Found' });
      spyOn(httpService, 'handleError').and.returnValue(asyncError(errorResponse));

      service.changeActiveConversation(mockID, mockIndex).subscribe({
        next: () => done.fail,
        error: (err: HttpErrorResponse) => {
          expect(err.status).toEqual(errorResponse.status);
          done();
        }
      })

      const req = httpTestingController.expectOne(`${service.configUrl}/api/chat/change/${mockID}`);
      req.error(new ProgressEvent('error'), errorResponse);
    })
  })

  describe('companion', () => {
    const mockUser = UserClass as UserInterface;
    const mockID: string = mockUser.id as string;

    it('should be return user and add in conversation', (done: DoneFn) =>{
      const response = new HttpResponse({ status: 200, body: mockUser });

      service.companion(mockID).subscribe({
        next: (user: UserInterface) => {
          expect(user).toEqual(mockUser);
          done();
        },
        error: () => done.fail,
      })

      const req = httpTestingController.expectOne(`${service.configUrl}/api/chat/companion/${mockID}`);
      expect(req.request.method).toEqual('GET');
      req.event(response);
    })

    it('should be return error not found user', (done: DoneFn) => {
      const errorResponse = new HttpErrorResponse({status: 404, statusText: 'not found user'});
      spyOn(httpService, 'handleError').and.returnValue(asyncError(errorResponse));

      service.companion(mockID).subscribe({
        next: () => done.fail,
        error: (err: HttpErrorResponse) => {
          expect(err).toEqual(errorResponse);
          done();
        }
      })

      const req = httpTestingController.expectOne(`${service.configUrl}/api/chat/companion/${mockID}`);
      req.error(new ProgressEvent('error'), )
    })
  })

  describe("sendNewMessage", () => {
    const mockID: string = chatClass.id
    const mockMessage = messageClass as MessageInterface;

    beforeEach(() => {
      service.setChat = chatClass as ChatInterface;
    })

    it('should add new message and return his', (done: DoneFn) => {
      const response = new HttpResponse({status: 202, body: mockMessage});

      service.sendNewMessage(mockMessage.message as string).subscribe({
        next: (message: MessageInterface) => {
          expect(message).toEqual(mockMessage);
          done();
        },
        error: () => done.fail,
      })

      const req = httpTestingController.expectOne(`${service.configUrl}/api/chat/send/${mockID}`);
      expect(req.request.method).toEqual('PUT');
      req.event(response);
    })

    it("should be return error not found chat", (done: DoneFn) => {
      const errorResponse = new HttpErrorResponse({status: 404, statusText: 'error not found chat'});
      spyOn(httpService, 'handleError').and.returnValue(asyncError(errorResponse));

      service.sendNewMessage(mockMessage.message as string).subscribe({
        next: () => done.fail,
        error: (err: HttpErrorResponse) => {
          expect(err.status).toEqual(errorResponse.status);
          done();
        }
      })

      const req = httpTestingController.expectOne(`${service.configUrl}/api/chat/send/${mockID}`)
      req.error(new ProgressEvent('error'));
    })
  })

  it("should append new friend, appendFriend", () => {
    const mockFriend = {...userClass, id: 'friendId'} as UserInterface;

    service.appendFriend(mockFriend);
    expect(service.friends.length).toEqual(1);
  })

  it('set user, setFirstUser', () => {
    const mockID = 'fakeID';

    service.setFirstUser(mockID);
    expect(service.first).toEqual(mockID);
  })

  it('clear user, clearFirstUser', () => {
    service.clearFirstUser().subscribe({
      next: (users: UserInterface[]) => expect(users).toEqual([])
    });
  })

  it('no read message, checkNoRead', () => {
    const mockID = 'fakeID';
    service.setNoReadFriend = [mockID];

    service.checkNoRead(mockID);

    expect(service.noReadFriend).toEqual([])
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
