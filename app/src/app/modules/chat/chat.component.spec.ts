import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ChatComponent } from './chat.component';
import {ChatService} from "../../core/service/chat.service";
import {of} from "rxjs";
import {RouterTestingModule} from "@angular/router/testing";
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from "@angular/core";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {ChatClass} from "../../../utils/chat-class";
import {ChatInterface} from "../../core/interface/chat.interface";
import {By} from "@angular/platform-browser";

class MockChatService {
  get getChat() { return of() };
}

describe('ChatComponent', () => {
  let component: ChatComponent;
  let fixture: ComponentFixture<ChatComponent>;
  let chatService: ChatService;

  let chatClass = ChatClass;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        ChatComponent
      ],
      imports: [
        RouterTestingModule,
        IonicModule.forRoot(),
        HttpClientTestingModule
      ],
      providers: [
        { provide: ChatService, useClass: MockChatService },
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatComponent);
    chatService = TestBed.inject(ChatService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit', () => {
    let mockChatClass = chatClass as ChatInterface;
    let spyGetChat = spyOnProperty(chatService, 'getChat', 'get').and.callFake(() => of(mockChatClass));

    component.ngOnInit();
    expect(spyGetChat).toHaveBeenCalled();
    expect(component.chat).toEqual(mockChatClass);
  })

  it('ngOnDestroy', () => {
    component.chatSub = of().subscribe();
    let spyChatSub = spyOn(component.chatSub, 'unsubscribe');

    component.ngOnDestroy();
    expect(spyChatSub).toHaveBeenCalled();
  })

  it('onBack', () => {
    let divBack = fixture.debugElement.query(By.css('.chat__back'))

    divBack.nativeNode.click();
    expect(component.view).toBeFalse();
  })

  it('getView', () => {
    let getView = component.getView;

    expect(getView).toBeTruthy()
  })
});
