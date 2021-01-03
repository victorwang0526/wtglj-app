import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-law-detail',
  templateUrl: 'law-detail.html',
})
export class LawDetailPage {

  item: {name: '', content: ''}

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.item = navParams.get('item');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LawDetailPage');
  }

}
