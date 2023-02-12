import {Component, Input, OnInit} from '@angular/core';
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
})
export class GalleryComponent implements OnInit {
  configUrl = environment.configUrl;

  @Input('images') images: string[];

  constructor() { }

  ngOnInit() {}

  slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true,
    infinite: true,
    speed: 300,
  };

  get getSlider() {
    return this.images.map((img) => `${this.configUrl}/${img}`);
  }
}
