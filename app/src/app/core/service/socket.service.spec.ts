import { TestBed } from '@angular/core/testing';

import { SocketService } from './socket.service';
import {ChatService} from "./chat.service";
import {UserService} from "./user.service";
import {PersonService} from "./person.service";
import {StorageService} from "./storage.service";
import {RouterTestingModule} from "@angular/router/testing";
import {Router, Routes} from "@angular/router";
import {UserClass} from "../../../utils/user-class";
import {HomeComponent} from "../../modules/home/home.component";
import {of} from "rxjs";
import {UserInterface} from "../interface/user.interface";
import {MessageClass} from "../../../utils/message-class";
import {MessageInterface} from "../interface/message.interface";
import {Socket} from "socket.io-client";


describe('SocketService', () => {
  let router: Router;
  let serverSocket: SocketService;
  let chatServiceSpy: ChatService;
  let userServiceSpy: UserService;
  let personServiceSpy: PersonService;
  let storageServiceSpy: StorageService;
  let routerTesting: RouterTestingModule;

  let userClass = UserClass;
  let messageClass = MessageClass;

  beforeAll(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        Router,
        SocketService,
        RouterTestingModule,
        // RouterTestingModule.withRoutes(routes),
        { provide: ChatService, useValue: {} },
        { provide: UserService, useValue: {} },
        { provide: PersonService, useValue: { getPerson: () => {}} },
        { provide: StorageService, useValue: { get: () => {}} },
      ],
    });

    router = TestBed.inject(Router);
    serverSocket = TestBed.inject(SocketService);
    routerTesting = TestBed.inject(RouterTestingModule);
    chatServiceSpy = TestBed.inject(ChatService) as jasmine.SpyObj<ChatService>;
    userServiceSpy = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    personServiceSpy = TestBed.inject(PersonService) as jasmine.SpyObj<PersonService>;
    storageServiceSpy = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;

  });


  it('should be created', () => {
    expect(serverSocket).toBeTruthy();
  });

  it('should return person on id. getPerson',  async () => {
    let mockID: string = userClass.id as string;
    let mockUser: UserInterface = UserClass as UserInterface;

    spyOnProperty(router, 'url', 'get').and.returnValue(`/person/${mockID}`);
    let getPersonSpy = spyOn(personServiceSpy, "getPerson").and.returnValue(of(mockUser));

    serverSocket.getPerson({ id: mockID });
    expect(getPersonSpy).toHaveBeenCalledWith(mockID);
  })


  describe('createSocket', () => {
    it('create socket false', async () => {
      let storeSpy = spyOn(storageServiceSpy, 'get').and.returnValue(Promise.resolve(undefined));
      let createSpy = await serverSocket.createSocket();
      expect(createSpy).toBeFalse();
      expect(storeSpy).toHaveBeenCalled();
    })

    it('create socket true', async () => {
      let storeSpy = spyOn(storageServiceSpy, 'get').and.returnValue(Promise.resolve('someToken'));
      let createSpy = await serverSocket.createSocket();

      expect(createSpy).toBeTruthy();
      expect(storeSpy).toHaveBeenCalled();
    })
  })

  describe('reconnectSocket', () => {
    it('reconnect undefined', async () => {
      let storeSpy = spyOn(storageServiceSpy, 'get').and.returnValue(Promise.resolve(undefined));
      let reconnectSpy = await serverSocket.reconnectSocket();

      expect(reconnectSpy).toBeUndefined();
      expect(storeSpy).toHaveBeenCalled();
    })

    it('reconnect success', async () => {
      let storeSpy = spyOn(storageServiceSpy, 'get').and.returnValue(Promise.resolve('someToken'));
      let reconnectSpy = await serverSocket.reconnectSocket();

      // expect(reconnectSpy).toHaveBeenCalled();
      expect(storeSpy).toHaveBeenCalled();
    })
  })

  describe('socket emit', () => {
    let socketSpy: Socket;

    beforeEach(async () => {
      spyOn(storageServiceSpy, 'get').and.returnValue(Promise.resolve('someToken'));
      await serverSocket.connect();
      serverSocket.getSocket.subscribe((socket: Socket) => {
        socketSpy = socket
      })
    })

    it('append to room appendToRoom', () => {
      let mockID = 'fakeID';
      let spyEmit = spyOn(serverSocket.socket, 'emit');

      serverSocket.appendToRoom(mockID);
      expect(spyEmit).toHaveBeenCalledWith('append-to-room', {roomID: mockID});
    })

    it('message receive. messageReceive',  () => {
      let mockID = 'fakeID';
      let mockMessage = messageClass as MessageInterface;
      let spyEmit = spyOn(serverSocket.socket, 'emit');

      serverSocket.messageReceive(mockID, mockMessage)
      expect(spyEmit).toHaveBeenCalled();
    })

    it('message delete. messageDel', () => {
      let mockID = 'fakeID';
      let mockMessage = messageClass as MessageInterface;
      let spyEmit = spyOn(socketSpy, 'emit');

      serverSocket.messageDel({chatID: mockID, message: mockMessage});
      expect(spyEmit).toHaveBeenCalledWith('delete', { chatID: mockID , message: mockMessage });
    })
  })

});
