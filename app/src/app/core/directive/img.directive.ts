import {Directive, ElementRef, OnInit} from '@angular/core';
import {environment} from "../../../environments/environment";

@Directive({
  selector: '[appImg]'
})
export class ImgDirective implements OnInit{
  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.el.nativeElement.src = `${environment.configUrl}/${this.el.nativeElement.src.split("/").pop()}`
  }

}
