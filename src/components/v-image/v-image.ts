import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ImagePreviewPage} from "../../pages/image-preview/image-preview";
import {NavController} from "ionic-angular";

@Component({
  selector: 'v-image',
  templateUrl: 'v-image.html'
})
export class VImageComponent {

  @Input() imgUrl: string = '';

  @Output() remove: EventEmitter<any> = new EventEmitter<any>();

  @Input() showRemove: boolean = false;

  @Input() loading: boolean = false;

  constructor(public navCtrl: NavController,) {
    console.log('Hello VImageComponent Component');
  }

  removeImg() {
    this.remove.emit(this.imgUrl);
  }

  openPreview() {
    this.navCtrl.push(ImagePreviewPage, {imgUrl: this.imgUrl});
  }

}
