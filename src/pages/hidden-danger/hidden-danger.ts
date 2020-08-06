import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the HiddenDangerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-hidden-danger',
  templateUrl: 'hidden-danger.html',
})
export class HiddenDangerPage {
  dangers: any[] = [];
  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad HiddenDangerPage');
  }

  openDangerDetail() {}
}
