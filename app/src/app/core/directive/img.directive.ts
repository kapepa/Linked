import {Directive, ElementRef, OnInit} from '@angular/core';
import {environment} from "../../../environments/environment";

@Directive({
  selector: '[appImg]'
})
export class ImgDirective implements OnInit{
  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.el.nativeElement.src =
      this.el.nativeElement.src === 'http://localhost:4200/'
        ? 'assets/images/fake.png'
        :`${environment.configUrl}/${this.el.nativeElement.src.split("/").pop()}`;
  }

}
