import { Component, OnInit } from '@angular/core';
import { ChatInterface } from "../../core/interface/chat.interface";
import { Subscription } from "rxjs";
import { UserInterface } from "../../core/interface/user.interface";
import { UserService } from "../../core/service/user.service";
import { FormBuilder, Validators } from "@angular/forms";
import { ChatService } from "../../core/service/chat.service";
import { MessageInterface } from "../../core/interface/message.interface";
import { SocketService } from "../../core/service/socket.service";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
