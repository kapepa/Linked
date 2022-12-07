import { Component, OnInit } from '@angular/core';
import { timer } from 'rxjs';
import { PostService } from "../../core/service/post.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  searchSend: any;
  search = false;

  constructor(
    private postService: PostService,
  ) { }

  ngOnInit() {}

  onSearch(e: Event) {
    let val = (e.currentTarget as HTMLIonInputElement).value;
    if(!!this.searchSend) this.searchSend.unsubscribe();

    this.searchSend = timer(3000).subscribe({
      next: () => {
        this.postService.setSearchWorld = val.toString();
        this.searchSend.unsubscribe();
      },
      complete: () => {
        this.searchSend.unsubscribe();
      },
    })
  }

  cleanSearch(e: Event) {
    this.postService.setSearchWorld = '';
  }
}
