import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {ConversationComponent} from './conversation.component';
import {UserService} from "../../core/service/user.service";
import {ChatService} from "../../core/service/chat.service";
import {SocketService} from "../../core/service/socket.service";
import {of} from "rxjs";
import {UserClass} from "../../../utils/user-class";
import {MessageClass} from "../../../utils/message-class";
import {ChatClass} from "../../../utils/chat-class";
import {ChatInterface} from "../../core/interface/chat.interface";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {UserInterface} from "../../core/interface/user.interface";
import {MessageInterface} from "../../core/interface/message.interface";
import {By} from "@angular/platform-browser";

class MockUserService {
  get getUser () { return of(UserClass) }
}

class MockChatService {
  get getMessageLimited() { return of(false) };
  get getFriends() { return of([UserClass]) };
  get getMessages() { return of([MessageClass]) };
  get getChatLoad() { return of(false) };
  get getChat() { return of(ChatClass as ChatInterface) };
  sendNewMessage(message: string) { return of(MessageClass) };
  messageReceive(message: MessageInterface) { };
  deleteMessage(index: number, message: MessageInterface) { return of({}) };
  loadMessage() {};
}

class MockSocketService {
  appendToRoom(roomID: string) {};
}


describe('ConversationComponent', () => {
  let component: ConversationComponent;
  let fixture: ComponentFixture<ConversationComponent>;

  let userService: UserService;
  let chatService: ChatService;
  let socketService: SocketService;

  let userClass = UserClass;
  let chatClass = ChatClass;
  let messageClass = MessageClass;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ConversationComponent ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        IonicModule.forRoot()
      ],
      providers: [
        { provide: UserService, useClass: MockUserService },
        { provide: ChatService, useClass: MockChatService },
        { provide: SocketService, useClass: MockSocketService },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ConversationComponent);
    userService = TestBed.inject(UserService);
    chatService = TestBed.inject(ChatService);
    socketService = TestBed.inject(SocketService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit', () => {
    let mockUser = userClass as UserInterface;
    let mockFriends = [userClass as UserInterface];
    let mockMessages = [messageClass as MessageInterface];
    let mockChat = chatClass as ChatInterface;

    let spyGetUser = spyOnProperty(userService, 'getUser', "get").and.returnValue(of(mockUser));
    let spyGetMessageLimited = spyOnProperty(chatService, 'getMessageLimited', 'get').and.returnValue(of(false));
    let spyGetFriends = spyOnProperty(chatService, 'getFriends', 'get').and.returnValue(of(mockFriends));
    let spyGetMessages = spyOnProperty(chatService, 'getMessages', 'get').and.returnValue(of(mockMessages));
    let spyGetChatLoad = spyOnProperty(chatService, 'getChatLoad', 'get').and.returnValue(of(false));
    let spyGetChat = spyOnProperty(chatService, 'getChat', 'get').and.returnValue(of(mockChat));
    let spyAppendToRoom = spyOn(socketService, 'appendToRoom');

    component.ngOnInit();

    expect(spyGetUser).toHaveBeenCalled();
    expect(spyGetMessageLimited).toHaveBeenCalled();
    expect(spyGetFriends).toHaveBeenCalled();
    expect(spyGetMessages).toHaveBeenCalled();
    expect(spyGetChatLoad).toHaveBeenCalled();
    expect(spyGetChat).toHaveBeenCalled();
    expect(spyAppendToRoom).toHaveBeenCalledOnceWith(mockChat.id as string);

    expect(component.user).toEqual(mockUser);
    expect(component.limited).toBeFalse();
    expect(component.friends).toEqual(mockFriends);
    expect(component.messages).toEqual(mockMessages);
    expect(component.chatLoad).toBeFalse();
    expect(component.chatID).toEqual(mockChat.id);
    expect(component.chat).toEqual(mockChat.chat as MessageInterface[])
  })

  it('ngOnDestroy', () => {
    component.userSub = of({}).subscribe();
    component.chatSub = of({}).subscribe();
    component.messagesSub = of({}).subscribe();
    component.friendsSub = of({}).subscribe();
    component.chatLoadSub = of({}).subscribe();

    let spyUserSub = spyOn(component.userSub, 'unsubscribe');
    let spyChatSub = spyOn(component.chatSub, 'unsubscribe');
    let spyMessagesSub = spyOn(component.messagesSub, 'unsubscribe');
    let spyFriendsSub = spyOn(component.friendsSub, 'unsubscribe');
    let spyChatLoadSub = spyOn(component.chatLoadSub, 'unsubscribe');

    component.ngOnDestroy();

    expect(spyUserSub).toHaveBeenCalled();
    expect(spyChatSub).toHaveBeenCalled();
    expect(spyMessagesSub).toHaveBeenCalled();
    expect(spyFriendsSub).toHaveBeenCalled();
    expect(spyChatLoadSub).toHaveBeenCalled();
  })

  it('onSubmit', () => {
    let fakeMessage: string = 'fake message.'
    let mockMessage: MessageInterface = {...messageClass, message: fakeMessage} as MessageInterface;
    let spySendNewMessage = spyOn(chatService, 'sendNewMessage').and.returnValue(of(mockMessage));
    let spyMessageReceive = spyOn(chatService, 'messageReceive');
    let form = fixture.debugElement.query(By.css('.conversation__form'));

    component.textarea.get('message')?.patchValue(fakeMessage);
    form.triggerEventHandler('submit', {});

    expect(spySendNewMessage).toHaveBeenCalledWith(fakeMessage);
    expect(spyMessageReceive).toHaveBeenCalledWith(mockMessage);
  })

  it('onDel', () => {
    let mockMessage: MessageInterface = messageClass as MessageInterface;
    let spyOnDeleteMessage = spyOn(chatService, 'deleteMessage').and.returnValue(of({}));
    let divDel = fixture.debugElement.query(By.css('.conversation_message__del'));

    component.chat = [mockMessage];
    divDel.nativeElement.click();

    expect(spyOnDeleteMessage).toHaveBeenCalledWith(0, mockMessage);
  })

  it('loadData', () => {
    component.limited = false;
    component.friends = [userClass as UserInterface];
    component.messages = Array(21).fill(messageClass);

    fixture.detectChanges();

    let spyLoadMessage = spyOn(chatService, 'loadMessage').and.returnValue(of());
    let infiniteScroll = fixture.debugElement.query(By.css('ion-infinite-scroll'));

    infiniteScroll.triggerEventHandler('ionInfinite', { target: { complete: () => {} } })
    expect(spyLoadMessage).toHaveBeenCalled();
  })

});
