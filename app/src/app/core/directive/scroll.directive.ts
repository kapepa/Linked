import {Directive, ElementRef, OnInit} from '@angular/core';

@Directive({
  selector: '[appScroll]'
})
export class ScrollDirective implements OnInit {
  constructor(private el: ElementRef) {}

  ngOnInit() {
    const stylesheet = `
      ::-webkit-scrollbar {
        width: 5px;
      }
      ::-webkit-scrollbar-track {
        background: transparent;
      }
      ::-webkit-scrollbar-thumb {
        border-radius: 10px;
        background: gray;
        border: 4px solid #3880ff;
      }`;

    const styleElmt = this.el.nativeElement.shadowRoot.querySelector('style');

    if (styleElmt) {
      styleElmt.append(stylesheet);
    } else {
      const barStyle = document.createElement('style');
      barStyle.append(stylesheet);
      this.el.nativeElement.shadowRoot.appendChild(barStyle);
    }
  }

}
