import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChatInterface } from "../../core/interface/chat.interface";
import { Subscription } from "rxjs";
import { UserInterface } from "../../core/interface/user.interface";
import { UserService } from "../../core/service/user.service";
import { FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, OnDestroy {
  textarea = this.fb.group({
    message: ['', Validators.required],
  })
  chat = [{}] as ChatInterface[];
  chatSub: Subscription;
  user: UserInterface;
  userSub: Subscription;

  constructor(
    private userService: UserService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.userSub = this.userService.getUser.subscribe((user: UserInterface) => this.user = user);
    this.chat = [{owner: this.user, message: 'Test message'}]
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

  onSubmit() {
    if(!this.textarea.valid) return;
    let newMessage = { owner: this.user, message: this.textarea.value.message } as ChatInterface;

    this.chat.push(newMessage);
  }

  onDel(index: number) {
    this.chat.splice(index, 1);
  }
}
