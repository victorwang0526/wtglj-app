import {Component} from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-image-preview',
  templateUrl: 'image-preview.html',
})
export class ImagePreviewPage {

  imgUrl: string = '';

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.imgUrl = this.navParams.get('imgUrl');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ImagePreviewPage');
  }

}
