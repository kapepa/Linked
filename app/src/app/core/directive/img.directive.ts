import {Directive, ElementRef, OnInit} from '@angular/core';
import {environment} from "../../../environments/environment";

@Directive({
  selector: '[appImg]'
})
export class ImgDirective implements OnInit{
  constructor(private el: ElementRef) {}

  ngOnInit() {
    switch (true) {
      case new RegExp('https://').test(this.el.nativeElement.src) :
        this.el.nativeElement.src;
        break
      case this.el.nativeElement.src === 'http://localhost:4200/' :
        this.el.nativeElement.src = 'assets/images/fake.png';
        break
      default :
        this.el.nativeElement.src = `${environment.configUrl}/${this.el.nativeElement.src.split("/").pop()}`;
        break
    }
  }
}
