import {Directive, ElementRef, OnInit} from '@angular/core';
import {environment} from "../../../environments/environment";
// import FakeImg  from "../../../assets/images/facke.png";

@Directive({
  selector: '[appImg]'
})
export class ImgDirective implements OnInit{
  constructor(private el: ElementRef) {}

  ngOnInit() {
    let img = new Image();
    img.src = `${environment.configUrl}/${this.el.nativeElement.src.split("/").pop()}`

    img.onload = (data) => {
      // this.el.nativeElement.src = `${environment.configUrl}/${this.el.nativeElement.src.split("/").pop()}`
      this.el.nativeElement.src = data.isTrusted
        ? `${environment.configUrl}/${this.el.nativeElement.src.split("/").pop()}`
        : 'assets/images/fake.png';
    }
  }

}
