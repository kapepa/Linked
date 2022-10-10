import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {from, of, Subscription} from "rxjs";
import {switchMap} from "rxjs/operators";
import {AuthService} from "../../core/service/auth.service";

@Component({
  selector: 'app-tape-profile',
  templateUrl: './tape-profile.component.html',
  styleUrls: ['./tape-profile.component.scss'],
})
export class TapeProfileComponent implements OnInit, OnDestroy {
  userAvatar: string = '';
  userAvatarSubscription: Subscription;
  @ViewChild('avatar') avatar: ElementRef;

  constructor(
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.userAvatarSubscription = this.authService.userAvatar.subscribe((avatar: string) => this.userAvatar = avatar);
  }

  ngOnDestroy() {
    this.userAvatarSubscription.unsubscribe();
  }

  onAvatar(e: Event) { (this.avatar.nativeElement as HTMLInputElement).click() };

  onFile(e: Event) {
    const validTypes = ['image/png', 'image/jpg', 'image/jpeg'];
    const file = (e.target as HTMLInputElement).files[0];
    const form = new FormData();
    form.append('file', file);

    from(file.arrayBuffer()).pipe(
      switchMap(
        (fileTypeResult: ArrayBuffer) => {
          if (!fileTypeResult) return of();
          if (!validTypes.includes(file.type)) return of();

          return this.authService.avatar(form);
        }
      )
    ).subscribe(() => {
      (e.target as HTMLInputElement).value = '';
    })
  }
}
