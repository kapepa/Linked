import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { SocketService } from "./core/service/socket.service";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{
  constructor(
    private storage: Storage,
    private socketService: SocketService,
  ) {};

  async ngOnInit() {
    // await this.storage.clear()
    await this.storage.create();
    await this.socketService.connect();
  }
}
